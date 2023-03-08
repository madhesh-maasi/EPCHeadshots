import * as React from "react";
import {
  Icon,
  Label,
  TextField,
  Dropdown,
  Checkbox,
  DatePicker,
  Spinner,
} from "@fluentui/react";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import styles from "./SubmitHS.module.scss";
import * as moment from "moment";
import SPServices from "../SPServices";
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

interface ISubHeadShot {
  Name: number;
  EmployeeId: string | number;
  Division: string;
  Title: string;
  ChargeCode: string | number;
  AddNotes: string;
  Attachments?: any;
  CheckBox1: boolean;
  FirstBoxDate: any;
  CheckBox2: boolean;
  SecondBoxDate: any;
}

interface IListHS {
  Title: string;
  UserNameId: number;
  Status: string;
  EmployeeId: string | number;
  ChargeCode: string | number;
  AdditionalNotes: string;
  DoYouNeedBioPublished: boolean;
  IsHeadshotForNewJoiner: boolean;
  PressReleasePublishedDate: any;
  newJoinerPublishedDate: any;
}

interface IDropdown {
  key: any;
  text: any;
}

let userMail: string[] = [];

const SubmitHS = (props: any): JSX.Element => {
  /* Local variable section start */
  let curObject: ISubHeadShot = {
    Name: props.currentUser.Id,
    EmployeeId: "",
    Division: "",
    Title: "",
    ChargeCode: "",
    AddNotes: "",
    Attachments: undefined,
    CheckBox1: false,
    FirstBoxDate: null,
    CheckBox2: false,
    SecondBoxDate: null,
  };
  /* Local variable section end */

  /* State create section start */
  const [newRecord, setNewRecord] = useState<ISubHeadShot>(curObject);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [divisionChoice, setDivisionChoice] = useState<IDropdown[]>();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  /* State create section end */

  /* function section start */
  /* get error function section */
  const getErrorFunction = (error: any) => {
    console.log("Error Message : ", error);
  };

  /* get list choice data function */
  const getDivisionChoice = async () => {
    await SPServices.SPGetChoices({
      Listname: props.ListName,
      FieldName: "Status",
    })
      .then((res: any) => {
        let arrDropdown: any[] = [];
        res.Choices.length > 0 &&
          res.Choices.forEach((data: any) => {
            arrDropdown.push({
              key: data,
              text: data,
            });
          });
        setDivisionChoice(arrDropdown);
        setIsLoader(false);
      })
      .catch((error: any) => {
        getErrorFunction(error);
      });
  };

  /* Prepare current object function section */
  const getCurrentObject = () => {
    let currentJSON: IListHS = {
      Title: newRecord.Title ? newRecord.Title : "",
      UserNameId: newRecord.Name ? newRecord.Name : null,
      Status: newRecord.Division ? newRecord.Division : "",
      EmployeeId: newRecord.EmployeeId ? newRecord.EmployeeId : "",
      ChargeCode: newRecord.ChargeCode ? newRecord.ChargeCode : "",
      AdditionalNotes: newRecord.AddNotes ? newRecord.AddNotes : "",
      DoYouNeedBioPublished: newRecord.CheckBox1,
      IsHeadshotForNewJoiner: newRecord.CheckBox2,
      PressReleasePublishedDate: newRecord.CheckBox1
        ? newRecord.FirstBoxDate
        : null,
      newJoinerPublishedDate: newRecord.CheckBox2
        ? newRecord.SecondBoxDate
        : null,
    };
    console.log(currentJSON);
    getAddData(currentJSON);
  };

  /* list add datas function section */
  const getAddData = async (currentJSON: IListHS) => {
    await SPServices.SPAddItem({
      Listname: props.ListName,
      RequestJSON: currentJSON,
    })
      .then((res: any) => {
        setIsSubmit(false);
        props.homePage();
      })
      .catch((error: any) => {
        getErrorFunction(error);
      });
  };
  /* function section end */

  /* Life-Cycle function section */
  useEffect(() => {
    setIsLoader(true);
    getDivisionChoice();
  }, []);

  return (
    <>
      {isLoader ? (
        <div>
          <Spinner />
        </div>
      ) : (
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
                onChange={(e) => {
                  userMail = [];
                  newRecord.Name = e.map((data: any) => {
                    return data.id;
                  })[0];
                  userMail = e.map((data: any) => {
                    return data.secondaryText;
                  });
                  setNewRecord({ ...newRecord });
                }}
                defaultSelectedUsers={
                  userMail.length > 0 ? userMail : props.currentUser.Email
                }
                required={true}
              />
            </div>
            <div className={styles.tooltipSection}>
              <Icon iconName="InfoSolid" className={styles.FormIconSec} />
              <div className={styles.tooltipBody}>
                Must type at least 3 characters of the users last name before a
                name selection will appear to choose from
              </div>
            </div>
          </div>

          {/* EMPLOYEE ID section */}
          <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
            <Label style={{ width: "18%" }}>
              EMPLOYEE ID:<span style={{ color: "red" }}> *</span>
            </Label>
            <div className={styles.FormInputSec}>
              <TextField
                placeholder="Please enter Employee Id"
                onChange={(e: any) => {
                  newRecord.EmployeeId = e.target.value;
                  setNewRecord({ ...newRecord });
                }}
              />
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
                options={divisionChoice}
                selectedKey={newRecord.Division}
                onChange={(e: any, text: any) => {
                  newRecord.Division = text.key;
                  setNewRecord({ ...newRecord });
                }}
              />
            </div>
          </div>

          {/* TITLE section */}
          <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
            <Label style={{ width: "18%" }}>TITLE:</Label>
            <div className={styles.FormInputSec}>
              <TextField
                placeholder="Not Defined"
                onChange={(e: any) => {
                  newRecord.Title = e.target.value;
                  setNewRecord({ ...newRecord });
                }}
              />
            </div>
          </div>

          {/* CHARGE CODE section */}
          <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
            <Label style={{ width: "18%" }}>
              CHARGE CODE:<span style={{ color: "red" }}> *</span>
            </Label>
            <div className={styles.FormInputSec}>
              <TextField
                placeholder="A1B2C3"
                onChange={(e: any) => {
                  newRecord.ChargeCode = e.target.value;
                  setNewRecord({ ...newRecord });
                }}
              />
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
              <TextField
                placeholder="Please enter text here"
                multiline={true}
                onChange={(e: any) => {
                  newRecord.AddNotes = e.target.value;
                  setNewRecord({ ...newRecord });
                }}
              />
            </div>
          </div>

          {/* ATTACHMENT section */}
          <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
            <Label style={{ width: "18%" }}>
              ATTACHMENT:<span style={{ color: "red" }}> *</span>
            </Label>
            <div className={styles.FormInputSec}>
              <input type="file" multiple={true} />
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
                    newRecord.CheckBox1 = isCheck;
                    setNewRecord({ ...newRecord });
                  }}
                />
                {newRecord.CheckBox1 && (
                  <>
                    <div style={{ width: "12%", marginLeft: "20px" }}>
                      <DatePicker
                        value={
                          newRecord.FirstBoxDate
                            ? new Date(newRecord.FirstBoxDate)
                            : new Date()
                        }
                        formatDate={(date: any) =>
                          moment(date).format("M/D/YYYY")
                        }
                        onSelectDate={(data: any) => {
                          newRecord.FirstBoxDate = new Date(data).toISOString();
                          setNewRecord({ ...newRecord });
                        }}
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
                    newRecord.CheckBox2 = isCheck;
                    setNewRecord({ ...newRecord });
                  }}
                />
                {newRecord.CheckBox2 && (
                  <>
                    <div style={{ width: "12%", marginLeft: "20px" }}>
                      <DatePicker
                        value={
                          newRecord.SecondBoxDate
                            ? new Date(newRecord.SecondBoxDate)
                            : new Date()
                        }
                        formatDate={(date: any) =>
                          moment(date).format("M/D/YYYY")
                        }
                        onSelectDate={(data: any) => {
                          newRecord.SecondBoxDate = new Date(
                            data
                          ).toISOString();
                          setNewRecord({ ...newRecord });
                        }}
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
              disabled={isSubmit}
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
              onClick={() => {
                setIsSubmit(true), getCurrentObject();
              }}
            >
              {isSubmit ? <Spinner /> : "SUBMIT"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmitHS;
