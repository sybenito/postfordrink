class helperService {
  static formatDate(date: string) {
    const utcDate = new Date(date);
    const day = utcDate.getUTCDate().toString().padStart(2, "0");
    const month = (utcDate.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = utcDate.getUTCFullYear().toString();

    return `${month}/${day}/${year}`;
  }
}

export default helperService;
