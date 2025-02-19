import { Popup } from "./Popup.jsx";
import { EntryContents } from "./EntryContents.jsx";
import { LightboxWrapper } from "./LightboxWrapper.jsx";
import { EntryHeader } from "./EntryHeader.jsx";
import { getImageFullUrl } from "../Customize/getImageFullUrl.js";
import { getUniqueId } from "../Customize/getUniqueId.js";

export function ShowEntry({
  show,
  big,
  showLightbox,
  openLightbox,
  closeLightbox,
  floatingStyles,
  floatingContext,
  setFloatingRef,
  closeShow,
  arrowRef,
}) {
  return (
    <>
      <div ref={setFloatingRef} style={{ ...floatingStyles, zIndex: 1 }}>
        {show && big && (
          <Popup
            show={show}
            closeShow={closeShow}
            arrowRef={arrowRef}
            openLightbox={openLightbox}
            floatingContext={floatingContext}
          />
        )}
      </div>
      {show && !big && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            overflow: "auto",
            backgroundColor: "var(--background-color)",
          }}
        >
          <EntryHeader show={show} close={closeShow} />
          <EntryContents
            key={getUniqueId(show)}
            show={show}
            showLightbox={showLightbox}
            openLightbox={openLightbox}
            close={closeShow}
          />
        </div>
      )}
      <LightboxWrapper
        show={showLightbox && show !== null}
        src={show ? getImageFullUrl(show) : undefined}
        close={closeLightbox}
      />
    </>
  );
}
