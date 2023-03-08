import * as React from "react";
import {
  Icon,
  Label,
  TextField,
  Dropdown,
  Checkbox,
  DatePicker,
} from "@fluentui/react";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import styles from "./SubmitHS.module.scss";
import * as moment from "moment";
import { useState, useEffect } from "react";
// import { FilePond, File, registerPlugin } from "react-filepond";

// // Import FilePond styles
// import "filepond/dist/filepond.min.css";
// // Import the Image EXIF Orientation and Image Preview plugins
// // Note: These need to be installed separately
// // `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
// import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
// import FilePondPluginImagePreview from "filepond-plugin-image-preview";
// import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
// registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

interface ICheckBox {
  Box1: boolean;
  Box2: boolean;
}

const SubmitHS = (props: any): JSX.Element => {
  /* Local variable section start */
  let isCheckBox: ICheckBox = {
    Box1: false,
    Box2: false,
  };
  /* Local variable section end */

  /* State create section start */
  const [isDateSec, setIsDateSec] = useState<ICheckBox>(isCheckBox);
  /* State create section end */

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

      {/* ADDITIONAL NOTES section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <Label style={{ width: "18%" }}>ADDITIONAL NOTES:</Label>
        <div className={styles.FormInputSec}>
          <TextField placeholder="Please enter text here" multiline={true} />
        </div>
      </div>

      {/* ATTACHMENT section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <Label style={{ width: "18%" }}>
          ATTACHMENT:<span style={{ color: "red" }}> *</span>
        </Label>
        <div className={styles.FormInputSec}>
          {/* <TextField placeholder="Please enter text here" multiline={true} /> */}
        </div>
      </div>

      {/* Check box section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <div style={{ width: "18%" }}></div>
        <div style={{ width: "82%" }}>
          {/* box one */}
          <div style={{ margin: "16px 0px", display: "flex" }}>
            <Checkbox
              label="Check box if you need your bio published by a specific date"
              onChange={(value: any, isCheck: boolean) => {
                isDateSec.Box1 = isCheck;
                setIsDateSec({ ...isDateSec });
              }}
            />
            {isDateSec.Box1 && (
              <>
                <div style={{ width: "12%", marginLeft: "20px" }}>
                  <DatePicker
                    value={new Date()}
                    formatDate={(date: any) => moment(date).format("M/D/YYYY")}
                    onSelectDate={(data: any) => {}}
                  />
                </div>
                <span style={{ color: "red", marginLeft: "6px" }}>*</span>
              </>
            )}
          </div>
          {/* box two */}
          <div style={{ margin: "16px 0px", display: "flex" }}>
            <Checkbox
              label="Check box if you need to hold on publishing your bio until a specific date"
              onChange={(value: any, isCheck: boolean) => {
                isDateSec.Box2 = isCheck;
                setIsDateSec({ ...isDateSec });
              }}
            />
            {isDateSec.Box2 && (
              <>
                <div style={{ width: "12%", marginLeft: "20px" }}>
                  <DatePicker
                    value={new Date()}
                    formatDate={(date: any) => moment(date).format("M/D/YYYY")}
                    onSelectDate={(data: any) => {}}
                  />
                </div>
                <span style={{ color: "red", marginLeft: "6px" }}>*</span>
              </>
            )}
          </div>
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

export default SubmitHS;
