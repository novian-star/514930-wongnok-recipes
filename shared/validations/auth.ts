import * as v from 'valibot';

export const LoginSchema = v.object({
  username: v.pipe(v.string(), v.trim(), v.minLength(1)),
  password: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

export const SignUpSchema = v.object({
  ...LoginSchema.entries,
  name: v.pipe(v.string(), v.trim(), v.minLength(1)),
});
