import * as React from "react";
import { Icon, Label, TextField, Dropdown } from "@fluentui/react";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import styles from "./SubmitHSQ.module.scss";
import { useState, useEffect } from "react";

interface ISubHeadShot {
  Name: number;
  EmployeeId: string | number;
  Division: string;
  Title: string;
  ChargeCode: string | number;
  Subject: string;
  HeadShotQuestion:string
  Attachments?: any;
}

const SubmitHSQ = (props: any): JSX.Element => {
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

      {/* EMPLOYEE ID section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <Label style={{ width: "18%" }}>
          EMPLOYEE ID:<span style={{ color: "red" }}> *</span>
        </Label>
        <div className={styles.FormInputSec}>
          <TextField placeholder="Please enter Employee Id" />
        </div>
        <Label className={styles.FormNaveLable}>
          To find your Employee ID, click
          <a
            href="https://itinfoalvarezandmarsal.sharepoint.com/sites/Marketing/SitePages/Headshot%20Submission%20and%20Retrieval.aspx"
            style={{ color: "#0d6efd", margin: "0px 5px" }}
          >
            here
          </a>
          for directions
        </Label>
      </div>

      {/* DIVISION section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <Label style={{ width: "18%" }}>
          DIVISION:<span style={{ color: "red" }}> *</span>
        </Label>
        <div className={styles.FormInputSec}>
          <Dropdown
            placeholder="Please select value here"
            options={[]}
            selectedKey={""}
            onChange={(e: any, text: any) => {}}
          />
        </div>
      </div>

      {/* TITLE section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <Label style={{ width: "18%" }}>TITLE:</Label>
        <div className={styles.FormInputSec}>
          <TextField placeholder="Not Defined" />
        </div>
      </div>

      {/* CHARGE CODE section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <Label style={{ width: "18%" }}>
          CHARGE CODE:<span style={{ color: "red" }}> *</span>
        </Label>
        <div className={styles.FormInputSec}>
          <TextField placeholder="A1B2C3" />
        </div>
        <Label className={styles.FormNaveLable}>
          To find your Employee ID, click
          <a
            href="https://itinfoalvarezandmarsal.sharepoint.com/sites/Marketing/SitePages/Headshot%20Submission%20and%20Retrieval.aspx"
            style={{ color: "#0d6efd", margin: "0px 5px" }}
          >
            here
          </a>
          for directions
        </Label>
      </div>

      {/* SUBJECT section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <Label style={{ width: "18%" }}>
          SUBJECT:<span style={{ color: "red" }}> *</span>
        </Label>
        <div className={styles.FormInputSec}>
          <TextField placeholder="Please enter subject here" />
        </div>
      </div>

      {/* HEADSHOT QUESTION section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <Label style={{ width: "18%" }}>
          HEADSHOT QUESTION:<span style={{ color: "red" }}> *</span>
        </Label>
        <div className={styles.FormInputSec}>
          <TextField
            placeholder="Please enter headshot question here"
            multiline={true}
          />
        </div>
      </div>

      {/* ATTACHMENT section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <Label style={{ width: "18%" }}>ATTACHMENT:</Label>
        <div style={{ width: "82%" }}>
          <input type="file" />
        </div>
      </div>

      {/* BTN section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <div style={{ width: "18%" }}></div>
        <button
          disabled={true}
          className={styles.FormBTN}
          style={
            true
              ? { border: "none", background: "#f4f4f4", cursor: "auto" }
              : {
                  border: "1px solid #8a8886",
                  background: "#fff",
                  cursor: "pointer",
                }
          }
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
};

export default SubmitHSQ;
