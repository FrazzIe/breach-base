const Wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export { Wait };