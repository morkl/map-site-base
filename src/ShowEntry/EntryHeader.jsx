import styles from "./Entry.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export function EntryHeader({ show, close }) {
  return show.name && (
    <div>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h3>{show.name || "Anonymous"}</h3>
        </div>
        <button onClick={close} className={styles.close}>
          <FontAwesomeIcon icon={faXmark} title="Close" />
        </button>
        <hr />
      </div>
    </div>
  );
}
