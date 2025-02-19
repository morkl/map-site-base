import { Img } from "./Img.jsx";
import { useOnEsc } from "../util/useOnEsc.jsx";
import styles from "./Entry.module.scss";
import { getImagePreviewUrl } from "../Customize/getImagePreviewUrl.js";
import { getImageFullUrl } from "../Customize/getImageFullUrl.js";

export function EntryContents({ show, showLightbox, openLightbox, close }) {
  useOnEsc(showLightbox ? () => {} : close);
  return (
    <div className={styles.show}>
      <Img
        src={getImagePreviewUrl(show)}
        full={getImageFullUrl(show)}
        openLightbox={openLightbox}
      />
      <div className={styles.text}>
        <em>
          {show.place
            ?.split(",")
            .map(
              (x) =>
                x.trim().charAt(0).toUpperCase() +
                x.trim().slice(1).toLowerCase(),
            )
            .join(", ")}
        </em>
        {show.caption && (
          <div
            style={{
              maxWidth: "45em",
            }}
          >
            {show.caption}
          </div>
        )}
      </div>
    </div>
  );
}
