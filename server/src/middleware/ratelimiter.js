import rateLimit from '../config/upstash.js';

const rateLimiter = async (_, res, next) => {
  try {
    const { success } = await rateLimit.limit('rate-limit');

    if (!success)
      return res
        .status(429)
        .json({ message: 'Too many requests,try again later.' });
    next();
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
    next(error);
  }
};

export default rateLimiter;
