import style from "./loading.module.scss";

function Loading() {
  return (
    <div className={style.loadingPage}>
      <div className={style.loadingAnimationContainer}>
        <div className={`${style.loadingLine}, ${style.one}`}></div>
        <div className={`${style.loadingLine}, ${style.two}`}></div>
        <div className={`${style.loadingLine}, ${style.three}`}></div>
      </div>
    </div>
  );
}

export default Loading;
