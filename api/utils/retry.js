exports.retry = async (fn, retries = 2, delay = 1000) => {
    let lastError;
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        console.warn(`Retry ${i + 1} failed:`, err.message);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
    throw lastError;
  };
  