import { object, string, number } from "zod";

const NEXT_YEAR = new Date().getFullYear() + 1;

const MOVIE_SCHEMA = object(
  {
    title: string(),
    year: number({
      message: "Must be between 1900 and the next year",
    })
      .min(1900)
      .max(NEXT_YEAR),
    rate: number().min(0).max(10, { message: "Rate must be between 0 and 10" }),
    url: string().url({ message: "Must be a valid URL" }),
  },
  { required_error: "All fields are required" }
);

const validateMovie = (input) => MOVIE_SCHEMA.safeParse(input);

export default validateMovie;
