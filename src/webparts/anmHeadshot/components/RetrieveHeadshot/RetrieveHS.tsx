import * as React from "react";
import { Icon, Label } from "@fluentui/react";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import styles from "./RetrieveHS.module.scss";
import { useState, useEffect } from "react";
import SPServices from "../SPServices";

const RetrieveHS = (props: any): JSX.Element => {
  console.log(props);
  const [selectedUser, setSelectedUser] = useState(props.currentUser.Id);
  const [btnDisable, setbtnDisbale] = useState(false);

  const getDatas = async (UserID) => {
    await SPServices.SPReadItems({
      Listname: "Headshot Workspace",
      Filter: [
        {
          FilterKey: "UserName",
          FilterValue: UserID,
          Operator: "eq",
        },
      ],
      Select: "*, UserName/Title, UserName/EMail, UserName/ID",
      Expand: "UserName",
    })
      .then((res: any) => {
        console.log(res);

        let URL = "";
        for (let i = 0; i < res.length; i++) {
          if (res[i].EmployeeId) {
            if (res[i].UserName) {
              if (res[i].UserName.Title) {
                let userName = res[i].UserName.Title.split(",");
                let URLSecondHalf = "";
                URLSecondHalf =
                  userName[0].trim() +
                  "_" +
                  userName[1].trim() +
                  "_" +
                  res[i].EmployeeId;
                URL =
                  "https://itinfoalvarezandmarsal.sharepoint.com/sites/Marketing/HeadshotAttachments/" +
                  URLSecondHalf;
              }
            }
            break;
          }
        }
        debugger;
        if (URL) {
          window.open(URL, "_blank");
        } else {
          alert(
            "Could not find headshot for given user. Please try with a different user."
          );
        }
      })
      .catch((error: any) => {
        alert("Something went wrong. Please contact system admin.");
      });
  };

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
            placeholder={`A&M Email`}
            personSelectionLimit={1}
            showtooltip={true}
            ensureUser={true}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000}
            onChange={(e) => {
              if (e.length > 0) {
                setSelectedUser(e[0].id);
                setbtnDisbale(false);
              } else {
                setbtnDisbale(true);
              }
            }}
            defaultSelectedUsers={props.currentUser.Email}
            required={true}
          />
        </div>
        <div className={styles.tooltipSection} style={{ display: "none" }}>
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
          disabled={btnDisable}
          className={styles.FormBTN}
          onClick={(e) => {
            getDatas(selectedUser);
          }}
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
