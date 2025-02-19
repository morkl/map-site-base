import Lightbox from "yet-another-react-lightbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Zoom } from "yet-another-react-lightbox/plugins";
import styles from "./LightboxWrapper.module.scss";
import { useMemo } from "react";
import { Loading } from "../Loading/Loading.jsx";

export function LightboxWrapper({ show, src, close }) {
  return useMemo(
    () => (
      <Lightbox
        open={show}
        close={close}
        slides={!src ? undefined : [{ src }]}
        carousel={{ finite: true }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
          buttonZoom: (zoomRef) => (
            <>
              <button onClick={zoomRef?.zoomIn} className={styles.btn}>
                <FontAwesomeIcon icon={faPlus} title="Zoom in" />
              </button>
              <button onClick={zoomRef?.zoomOut} className={styles.btn}>
                <FontAwesomeIcon icon={faMinus} title="Zoom out" />
              </button>
            </>
          ),
          buttonClose: () => (
            <button key="close" onClick={close} className={styles.btn}>
              <FontAwesomeIcon icon={faXmark} title="Close" />
            </button>
          ),
          iconLoading: () => <Loading />,
        }}
        plugins={[Zoom]}
        zoom={{ scrollToZoom: true }}
      />
    ),
    [show, src, close],
  );
}
