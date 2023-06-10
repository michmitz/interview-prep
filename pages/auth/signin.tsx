import { getProviders, getCsrfToken } from "next-auth/react";
import { InferGetServerSidePropsType } from "next";
import { CtxOrReq } from "next-auth/client/_utils";
import styles from "../../styles/SignIn.module.css";

const SignIn = ({
  providers,
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
      <div className={styles.container}>
        <p className={styles.loginText}>Login</p>
        <form
          method="post"
          action="/api/auth/signin/email"
          className={styles.form}
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            className={styles.input}
          />
          <button className={styles.button}>Submit</button>
        </form>
      </div>
  );
};

export const getServerSideProps = async (context: CtxOrReq | undefined) => {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: { providers, csrfToken },
  };
};

export default SignIn;
