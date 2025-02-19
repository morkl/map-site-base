import { EntryContents } from "./EntryContents.jsx";
import { FloatingArrow } from "@floating-ui/react";
import styles from "./Popup.module.scss";
import { EntryHeader } from "./EntryHeader.jsx";
import { settings } from "../Customize/settings.js";
import { getUniqueId } from "../Customize/getUniqueId.js";

export function Popup({
  show,
  closeShow,
  arrowRef,
  showLightbox,
  openLightbox,
  floatingContext,
}) {
  return (
    <div className={styles.popup}>
      <EntryHeader show={show} close={closeShow} />
      <div className={styles.body}>
        <EntryContents
          key={getUniqueId(show)}
          show={show}
          showLightbox={showLightbox}
          openLightbox={openLightbox}
          close={closeShow}
        />
      </div>
      <FloatingArrow
        ref={arrowRef}
        context={floatingContext}
        stroke="var(--border-color)"
        fill="var(--background-color)"
        height={settings.popupArrowHeight}
        width={settings.popupArrowWidth}
      />
    </div>
  );
}
