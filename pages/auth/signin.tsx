import { getProviders, getCsrfToken, useSession } from "next-auth/react";
import { InferGetServerSidePropsType } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { CtxOrReq } from "next-auth/client/_utils";
import styles from "../../styles/SignIn.module.css";

const SignIn = ({
  providers,
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <div
      style={{
        backgroundImage: `url('/backgrounds/background-1.jpg')`,
        height: "100vh",
        width: "100vw",
        backgroundSize: "cover",
        overflow: "auto",
        minHeight: "650px",
      }}
      className="centerContent"
    >

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
