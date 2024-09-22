import React, { useContext, useMemo, useReducer } from "react";
import type { FC } from "react";
import { Button, Select, Input, Form, Checkbox, Divider } from "antd";
import type { SelectProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ValidationRules } from "src/models/form";
import AuthContext from "src/store/auth-context";
import type { DrinkType, AlcoholType, MixerType, GarnishType, CocktailType } from "src/hooks/Order";

import "./index.scss";

const validationRules: ValidationRules = {
  alcoholRequired: { required: true, message: "Please select an drink" },
  optional: { required: false },
};

const initDrink: DrinkType = {
  cocktail: null,
  alcohol: null,
  mixer: [],
  garnish: [],
  double: false,
  request: "",
};

interface DrinkFormProps {
  submitDrink: (drink: DrinkType) => void;
  cocktail: CocktailType[];
  alcohol: AlcoholType[];
  mixer: MixerType[];
  garnish: GarnishType[];
  ticketsPending: number;
}

const DrinkForm: FC<DrinkFormProps> = ({ submitDrink, cocktail, alcohol, mixer, garnish, ticketsPending }) => {
  const { user } = useContext(AuthContext);

  const reduceDrink = (
    state: DrinkType,
    action: { type: string; payload: string | string[] | boolean | null }
  ): DrinkType => {
    const setCocktail = (s: DrinkType, payload: string) => {
      const cocktailObj = cocktail.find((a) => a.id === payload);
      return { ...s, cocktail: cocktailObj as CocktailType };
    };

    const setAlcohol = (s: DrinkType) => {
      const alcoholObj = alcohol.find((a) => a.id === action.payload);
      if (alcoholObj && !alcoholObj.canDouble) {
        return { ...s, alcohol: alcoholObj as AlcoholType, double: false };
      }
      return { ...s, alcohol: alcoholObj as AlcoholType };
    };

    const setMixer = (s: DrinkType, payload: string[]) => {
      const mixerObj = payload.map((m) => mixer.find((a) => a.id === m));
      return { ...s, mixer: mixerObj as MixerType[] };
    };

    const setGarnish = (s: DrinkType, payload: string[]) => {
      const garnishObj = payload.map((m) => garnish.find((a) => a.id === m));
      return { ...s, garnish: garnishObj as GarnishType[] };
    };

    switch (action.type) {
      case "SET_COCKTAIL":
        return setCocktail(state, action.payload as string);
      case "SET_ALCOHOL":
        return setAlcohol(state);
      case "SET_MIXER":
        return setMixer(state, action.payload as string[]);
      case "SET_GARNISH":
        return setGarnish(state, action.payload as string[]);
      case "SET_DOUBLE":
        return { ...state, double: action.payload as boolean };
      case "SET_REQUEST":
        return { ...state, request: action.payload as string };
      case "RESET":
        return initDrink;
      default:
        return state;
    }
  };

  const [drink, dispatchDrink] = useReducer(reduceDrink, initDrink);

  const cocktailOptions = () => {
    const options: SelectProps["options"] = cocktail
      .filter((a) => a.available === true)
      .map((a) => ({
        label: a.name,
        value: a.id,
      }));

    return options;
  };

  const alcoholOptions = () => {
    const options: SelectProps["options"] = alcohol
      .filter((a) => a.available === true)
      .map((a) => ({
        label: a.name,
        value: a.id,
      }));

    return options;
  };

  const mixerOptions = useMemo(
    (): SelectProps["options"] =>
      mixer
        .filter((a) => a.available === true)
        .map((a) => ({
          label: a.name,
          value: a.id,
        })),
    [mixer]
  );

  const garnishOptions = useMemo(
    (): SelectProps["options"] =>
      garnish
        .filter((a) => a.available === true)
        .map((a) => ({
          label: a.name,
          value: a.id,
        })),
    [garnish]
  );

  const handleSubmit = () => {
    submitDrink(drink);
    dispatchDrink({ type: "RESET", payload: null });
  };

  return (
    <>
      <Form name="orderCocktail" layout="vertical" onFinish={handleSubmit} className="drink-form">
        <Form.Item name="cocktail" rules={[validationRules.optional]}>
          <Select
            placeholder="Order a Cocktail"
            allowClear
            options={cocktailOptions()}
            onChange={(value) => {
              dispatchDrink({ type: "SET_COCKTAIL", payload: value });
            }}
            disabled={!!drink.alcohol || !!drink.mixer.length || !!drink.garnish.length}
          />
        </Form.Item>
        {drink.cocktail && drink.cocktail.description && (
          <h4 className="cocktail-desc">
            <span>About this cocktail:</span>
            <br />
            <i>{drink.cocktail.description}</i>
          </h4>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!drink.cocktail}>
            <PlusOutlined />
            Add Cocktail to Order
          </Button>
        </Form.Item>
      </Form>
      <br />
      <br />
      <Divider orientation="left">Create a Drink</Divider>
      <Form name="orderDrink" layout="vertical" onFinish={handleSubmit} className="drink-form">
        <Form.Item name="alcohol" rules={[validationRules.optional]}>
          <Select
            placeholder="Start With"
            allowClear
            options={alcoholOptions()}
            onChange={(value) => {
              dispatchDrink({ type: "SET_ALCOHOL", payload: value });
            }}
            disabled={!!drink.cocktail}
          />
        </Form.Item>
        {drink.alcohol && drink.alcohol.canDouble === true && (
          <Form.Item name="double" rules={[validationRules.optional]}>
            <Checkbox
              checked={drink.double}
              onChange={(e) => {
                dispatchDrink({ type: "SET_DOUBLE", payload: e.target.checked });
              }}
              disabled={user.tickets >= 2 && user.tickets - ticketsPending < 2}
            >
              Make it a Double
            </Checkbox>
          </Form.Item>
        )}
        <div className="stack">
          <Form.Item name="mixer" rules={[validationRules.optional]}>
            <Select
              placeholder="Mix With"
              options={mixerOptions}
              mode="multiple"
              allowClear
              onChange={(value) => {
                dispatchDrink({ type: "SET_MIXER", payload: value });
              }}
              disabled={!!drink.cocktail}
            />
          </Form.Item>
          <Form.Item name="garnish" rules={[validationRules.optional]}>
            <Select
              placeholder="Finish With"
              options={garnishOptions}
              mode="multiple"
              allowClear
              onChange={(value) => {
                dispatchDrink({ type: "SET_GARNISH", payload: value });
              }}
              disabled={!!drink.cocktail}
            />
          </Form.Item>
        </div>
        <Form.Item name="requests" rules={[validationRules.optional]}>
          <Input.TextArea
            placeholder="Additional Requests"
            autoSize={{ minRows: 2, maxRows: 2 }}
            onChange={(e) => {
              dispatchDrink({ type: "SET_REQUEST", payload: e.target.value });
            }}
            disabled={!!drink.cocktail}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!drink.alcohol}>
            <PlusOutlined />
            Add Drink to Order
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default DrinkForm;
