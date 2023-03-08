import * as React from "react";
import { Icon, Label } from "@fluentui/react";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import styles from "./RetrieveHS.module.scss";
import { useState, useEffect } from "react";

const RetrieveHS = (props: any): JSX.Element => {
  return (
    <div>
      {/* NAME section */}
      <div className={styles.FormSec}>
        <Label style={{ width: "18%" }}>
          NAME:<span style={{ color: "red" }}> *</span>
        </Label>
        <div className={styles.FormInputSec}>
          <PeoplePicker
            context={props.context}
            placeholder={`Insert people`}
            personSelectionLimit={1}
            showtooltip={true}
            ensureUser={true}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000}
            onChange={(e) => {}}
            defaultSelectedUsers={props.currentUser.Email}
            required={true}
          />
        </div>
        <div className={styles.tooltipSection}>
          <Icon iconName="InfoSolid" className={styles.FormIconSec} />
          <div className={styles.tooltipBody}>
            Must type at least 3 characters of the users last name before a name
            selection will appear to choose from
          </div>
        </div>
      </div>

      {/* BTN section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <div style={{ width: "18%" }}></div>
        <button
          disabled={false}
          className={styles.FormBTN}
          style={
            false
              ? { border: "none", background: "#f4f4f4", cursor: "auto" }
              : {
                  border: "1px solid #8a8886",
                  background: "#fff",
                  cursor: "pointer",
                }
          }
        >
          RETRIEVE
        </button>
      </div>
    </div>
  );
};

export default RetrieveHS;
