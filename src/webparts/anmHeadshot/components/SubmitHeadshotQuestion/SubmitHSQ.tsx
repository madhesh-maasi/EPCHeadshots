import * as React from "react";
import { Icon, Label, TextField, Dropdown, Spinner } from "@fluentui/react";
import { sp } from "@pnp/sp/presets/all";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import SPServices from "../SPServices";
import styles from "./SubmitHSQ.module.scss";
import { useState, useEffect } from "react";
import * as moment from "moment";

interface ISubHeadShot {
  Name: number;
  EmployeeId: string | number;
  Division: string;
  Title: string;
  ChargeCode: string | number;
  Subject: string;
  HeadShotQuestion: string;
  Attachments?: any;
}
interface IDropdown {
  key: any;
  text: any;
}
let userMail: string[] = [];
let curUserName: string = "";
let attachFiles: any[] = [];
let files: any[] = [];

const SubmitHSQ = (props: any): JSX.Element => {
  let currentobj = {
    Name: props.currentUser.Id,
    EmployeeId: "",
    Division: "",
    Title: props.currentUser.JobTitle,
    ChargeCode: "",
    Subject: "",
    HeadShotQuestion: "",
    SubmittedDate: null,

    Attachments: undefined,
  };

  const [formdata, setFormdata] = useState(currentobj);
  const [divisionChoice, setDivisionChoice] = useState<IDropdown[]>();
  const [isSubmit, setIsSubmit] = useState(false);
  const [charcode, setCharcode] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  //division values
  const getDivisionChoice = async () => {
    await SPServices.SPReadItems({
      Listname: "HSDivisions",
    })
      .then((res: any) => {
        let arrDropdown: any[] = [];
        //res.Choices.length > 0 &&
        res.forEach((data: any) => {
          if (data.Title)
            arrDropdown.push({
              key: data.Title.trim(),
              text: data.Title.trim(),
            });
        });
        setDivisionChoice(arrDropdown);
      })
      .catch((error: any) => {
        getErrorFunction(error);
      });
  };
  //Error
  const getErrorFunction = (error: any) => {
    console.log("Error Message : ", error);
  };
  //getting Formdata
  const getFormData = () => {
    let currentJson = {
      UserNameId: formdata.Name ? formdata.Name : "",
      EmployeeId: formdata.EmployeeId ? formdata.EmployeeId : "",
      Division: formdata.Division ? formdata.Division : "",
      ChargeCode: formdata.ChargeCode ? formdata.ChargeCode : "",
      Title: formdata.Title ? formdata.Title : "",
      Subject: formdata.Subject ? formdata.Subject : "",
      Description: formdata.HeadShotQuestion ? formdata.HeadShotQuestion : "",
      SubmittedDate: new Date().toISOString(),
    };
    addData(currentJson);
  };
  //adding data
  const addData = async (data) => {
    setIsLoader(true);

    await SPServices.SPAddItem({
      Listname: "Headshot Questions",
      RequestJSON: data,
    })
      .then(async (res: any) => {
        console.log(res, "res");

        await SPServices.SPAddAttachments({
          ListName: "Headshot Questions",
          ListID: res.data.ID,
          Attachments: attachFiles,
        })
          .then((res: any) => {
            alert(
              "Your question has been received. Please allow up to 5 business days for a response."
            );
            setIsLoader(false);

            props.homePage();
          })
          .catch((error: any) => {
            getErrorFunction(error);
          });
      })
      .catch((error: any) => {
        getErrorFunction(error);
      });
  };
  //disable submit buttons
  const onDisableButton = (datas) => {
    if (
      datas.Name &&
      datas.EmployeeId &&
      datas.ChargeCode &&
      datas.Subject &&
      datas.HeadShotQuestion &&
      datas.Division
      // charcode
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  };
  //get Files from Attachment
  const getFiles = (e) => {
    files = e.target.files;
    attachFiles = [];
    for (let i = 0; i < files.length; i++) {
      attachFiles.push({ name: files[i].name, content: files[i] });
    }
  };
  const validateCharcode = (text) => {
    const letterRegex = /[a-zA-Z]/g;
    const digitRegex = /[0-9]/g;
    const letters = text.match(letterRegex);
    const digits = text.match(digitRegex);
    return letters && digits && letters.length >= 3 && digits.length >= 3;
  };

  useEffect(() => {
    getDivisionChoice();
  }, []);

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
            onChange={(e: any) => {
              userMail = [];
              if (e.length > 0) {
                props.sp.profiles
                  .getUserProfilePropertyFor(e[0].loginName, "SPS-JobTitle")
                  .then((user) => {
                    formdata.Name = e.map((data: any) => {
                      return data.id;
                    })[0];

                    formdata.Title = user ? user : "Not Defined";

                    // userMail = e.map((data: any) => {
                    //   let arrUserName: string[] = data.text.split(" ");
                    //   let arrSplitName: string[] = [];
                    //   let arrUserNameLength: number = arrUserName.length - 1;
                    //   arrUserName.forEach((val: string, index: number) => {
                    //     if (index <= arrUserNameLength) {
                    //       if (!curUserName) {
                    //         arrSplitName = val.split(",");
                    //         curUserName = arrSplitName[0];
                    //       } else {
                    //         arrSplitName = val.split(",");
                    //         curUserName = curUserName + "_" + arrSplitName[0];
                    //       }
                    //     }
                    //   });
                    //   return data.secondaryText;
                    // });
                    setFormdata({ ...formdata });
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              } else {
                formdata.Name = e.map((data: any) => {
                  return data.id;
                })[0];
                formdata.Title = "";
                setFormdata({ ...formdata });
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

      {/* EMPLOYEE ID section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <Label style={{ width: "18%" }}>
          EMPLOYEE ID:<span style={{ color: "red" }}> *</span>
        </Label>
        <div className={styles.FormInputSec}>
          <TextField
            placeholder="Please enter Employee ID"
            onChange={(e: any) => {
              formdata.EmployeeId = e.target.value;
              setFormdata({ ...formdata });
              onDisableButton(formdata);
            }}
          />
        </div>
        <Label className={styles.FormNaveLable}>
          To find your Employee ID, click
          <a
            data-interception="off"
            target="_blank"
            href="https://itinfoalvarezandmarsal.sharepoint.com/sites/Marketing/SitePages/Charge-Code-and-Employee-ID.aspx"
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
            selectedKey={formdata.Division}
            onChange={(e: any, text: any) => {
              formdata.Division = text.key;
              setFormdata({ ...formdata });
              onDisableButton(formdata);
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
            value={formdata.Title}
            onChange={(e: any) => {
              formdata.Title = e.target.value;
              setFormdata({ ...formdata });
            }}
            disabled={formdata.Title ? true : false}
          />
        </div>
      </div>

      {/* CHARGE CODE section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <Label style={{ width: "18%" }}>
          CHARGE CODE:
          <span style={{ color: "red" }}> *</span>
        </Label>
        <div className={styles.FormInputSec}>
          <TextField
            placeholder="A1B2C3"
            onBlur={(e: any) => {
              let result = validateCharcode(e.target.value);
              // if (!result) {
              //   alert("Charge Code should be 6 digit alpha numeric value.");
              //   setCharcode(false);
              // } else {
              //   setCharcode(true);
              // }
            }}
            onChange={(e: any) => {
              formdata.ChargeCode = e.target.value;
              setFormdata({ ...formdata });
              onDisableButton(formdata);
            }}
          />
        </div>
        <Label className={styles.FormNaveLable}>
          To find your Charge Code, click
          <a
            data-interception="off"
            target="_blank"
            href="https://itinfoalvarezandmarsal.sharepoint.com/sites/Marketing/SitePages/Charge-Code-and-Employee-ID.aspx"
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
          <TextField
            placeholder="Please enter subject here"
            onChange={(e: any) => {
              formdata.Subject = e.target.value;
              setFormdata({ ...formdata });
              onDisableButton(formdata);
            }}
          />
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
            onChange={(e: any) => {
              formdata.HeadShotQuestion = e.target.value;
              setFormdata({ ...formdata });
              onDisableButton(formdata);
            }}
          />
        </div>
      </div>

      {/* ATTACHMENT section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <Label style={{ width: "18%" }}>ATTACHMENT:</Label>
        <div style={{ width: "82%" }}>
          <input type="file" multiple={true} onChange={(e) => getFiles(e)} />
        </div>
      </div>

      {/* BTN section */}
      <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
        <div style={{ width: "18%" }}></div>
        {isLoader ? (
          <Spinner />
        ) : (
          <button
            disabled={!isSubmit}
            className={styles.FormBTN}
            style={
              false
                ? { border: "none", background: "#f4f4f4", cursor: "auto" }
                : {
                    border: "1px solid #8a8886",
                    background: "#fff",
                    cursor: !isSubmit ? "auto" : "pointer",
                  }
            }
            onClick={() => getFormData()}
          >
            SUBMIT
          </button>
        )}
      </div>
    </div>
  );
};

export default SubmitHSQ;
