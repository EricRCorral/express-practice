const z = require("zod");

const NEXT_YEAR = new Date().getFullYear() + 1;

const MOVIE_SCHEMA = z.object(
  {
    title: z.string(),
    year: z
      .number({
        message: "Must be between 1900 and the next year",
      })
      .min(1900)
      .max(NEXT_YEAR),
    rate: z
      .number()
      .min(0)
      .max(10, { message: "Rate must be between 0 and 10" }),
    url: z.string().url({ message: "Must be a valid URL" }),
  },
  { required_error: "All fields are required" }
);

const validateMovie = (input) => MOVIE_SCHEMA.safeParse(input);

module.exports = { validateMovie };
