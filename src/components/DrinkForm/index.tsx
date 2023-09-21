import React, { useContext, useEffect, useMemo, useReducer } from "react";
import type { FC } from "react";
import { Button, Select, Input, Form, Checkbox } from "antd";
import type { SelectProps } from "antd";
import type { ValidationRules } from "src/models/form";
import AuthContext from "src/store/auth-context";
import type { DrinkType, AlcoholType, MixerType, GarnishType } from "src/hooks/Order";

const validationRules: ValidationRules = {
  alcoholRequired: { required: true, message: "Please select an drink" },
  optional: { required: false },
};

const initDrink: DrinkType = {
  alcohol: null,
  mixer: [],
  garnish: [],
  double: false,
  request: "",
};

const MAX_ALCOHOL = 2;

interface DrinkFormProps {
  submitDrink: (drink: DrinkType) => void;
  alcohol: AlcoholType[];
  mixer: MixerType[];
  garnish: GarnishType[];
  ticketsPending: number;
}

const DrinkForm: FC<DrinkFormProps> = ({ submitDrink, alcohol, mixer, garnish, ticketsPending }) => {
  const { user } = useContext(AuthContext);

  const reduceDrink = (
    state: DrinkType,
    action: { type: string; payload: string | string[] | boolean | null }
  ): DrinkType => {
    const setAlcohol = (s: DrinkType, payload: string | null) => {
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
      case "SET_ALCOHOL":
        return setAlcohol(state, action.payload as string);
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

  const alcoholOptions = () => {
    const options: SelectProps["options"] = alcohol.map((a) => ({
      label: a.name,
      value: a.id,
    }));

    return options;
  };

  const mixerOptions = useMemo(
    (): SelectProps["options"] =>
      mixer.map((a) => ({
        label: a.name,
        value: a.id,
      })),
    [mixer]
  );

  const garnishOptions = useMemo(
    (): SelectProps["options"] =>
      garnish.map((a) => ({
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
    <Form name="orderDrink" layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="alcohol" rules={[validationRules.alcoholRequired]}>
        <Select
          placeholder="Start With"
          allowClear
          options={alcoholOptions()}
          onChange={(value) => {
            dispatchDrink({ type: "SET_ALCOHOL", payload: value });
          }}
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
      <Form.Item name="mixer" rules={[validationRules.optional]}>
        <Select
          placeholder="Mix With"
          options={mixerOptions}
          mode="multiple"
          allowClear
          onChange={(value) => {
            dispatchDrink({ type: "SET_MIXER", payload: value });
          }}
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
        />
      </Form.Item>
      <Form.Item name="requests" rules={[validationRules.optional]}>
        <Input.TextArea
          placeholder="Additional Requests"
          autoSize={{ minRows: 2, maxRows: 2 }}
          onChange={(e) => {
            dispatchDrink({ type: "SET_REQUEST", payload: e.target.value });
          }}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Drink to Order
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DrinkForm;
