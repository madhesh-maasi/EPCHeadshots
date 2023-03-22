import * as React from "react";
import { sp } from "@pnp/sp/presets/all";
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
  SubmitterEmail: any;
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
  SubmitterEmailId: number;
  SubmittedDate?: any;
}

interface IDropdown {
  key: any;
  text: any;
}

let userMail: string[] = [];
let curUserName: string = "";
let arrAttachments: any[] = [];
let locFileArray: any[] = [];

const SubmitHS = (props: any): JSX.Element => {
  /* Local variable section start */
  let curObject: ISubHeadShot = {
    Name: props.currentUser.Id,
    EmployeeId: "",
    Division: "",
    Title: props.currentUser.JobTitle,
    ChargeCode: "",
    AddNotes: "",
    Attachments: undefined,
    CheckBox1: false,
    FirstBoxDate: null,
    CheckBox2: false,
    SecondBoxDate: null,
    SubmitterEmail: null,
  };
  /* Local variable section end */

  /* State create section start */
  const [newRecord, setNewRecord] = useState<ISubHeadShot>(curObject);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isLoaders, setIsLoaders] = useState<boolean>(false);

  const [divisionChoice, setDivisionChoice] = useState<IDropdown[]>();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>(props.currentUser.Title);
  const [isValidCharCode, setIsValidCharCode] = useState<boolean>(false);
  /* State create section end */

  /* function section start */
  /* get error function section */
  const getErrorFunction = (error: any) => {
    console.log("Error Message : ", error);
  };

  /* get list choice data function */
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
      SubmitterEmailId: newRecord.SubmitterEmail
        ? newRecord.SubmitterEmail
        : null,
      DoYouNeedBioPublished: newRecord.CheckBox1,
      IsHeadshotForNewJoiner: newRecord.CheckBox2,
      SubmittedDate: moment().format(),
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
    setIsLoaders(true);
    await SPServices.SPAddItem({
      Listname: props.ListName,
      RequestJSON: currentJSON,
    })
      .then((res: any) => {
        addLibraryData(currentJSON);
      })
      .catch((error: any) => {
        getErrorFunction(error);
      });
  };

  /* Library documents datas add function */
  const addLibraryData = async (currentJSON: IListHS) => {
    await props.sp.web.lists
      .getByTitle(props.LibraryName)
      .rootFolder.folders.add(folderName)
      .then(async (res: any) => {
        await res.folder
          .getItem()
          .then(async (item: any) => {
            await item
              .update({
                Status: currentJSON.Status,
                EmployeeId: currentJSON.EmployeeId,
                ChargeCode: currentJSON.ChargeCode,
                AdditionalNotes: currentJSON.AdditionalNotes,
                SubmittedDate: new Date().toISOString(),
              })
              .then((val: any) => {
                for (let i = 0; locFileArray.length > i; i++) {
                  props.sp.web
                    .getFolderByServerRelativeUrl(res.data.ServerRelativeUrl)
                    .files.add(
                      locFileArray[i].name,
                      locFileArray[i].content,
                      true
                    )
                    .then(async (data: any) => {
                      await data.file
                        .getItem()
                        .then(async (item: any) => {
                          await item
                            .update({
                              Status: currentJSON.Status,
                              EmployeeId: currentJSON.EmployeeId,
                              ChargeCode: currentJSON.ChargeCode,
                              AdditionalNotes: currentJSON.AdditionalNotes,
                              SubmittedDate: new Date().toISOString(),
                            })
                            .then((val: any) => {
                              if (locFileArray.length == i + 1) {
                                setIsSubmit(false);
                                alert(
                                  "Your submission has been received. Please allow up to 10 business days for a response."
                                );
                                setIsLoaders(false);
                                props.homePage();
                              }
                            })
                            .catch((error: any) => {
                              getErrorFunction(error);
                            });
                        })
                        .catch((error: any) => {
                          getErrorFunction(error);
                        });
                    })
                    .catch((error: any) => {
                      getErrorFunction(error);
                    });
                }
              })
              .catch((error: any) => {
                getErrorFunction(error);
              });
          })
          .catch((error: any) => {
            getErrorFunction(error);
          });
      })
      .catch((error: any) => {
        getErrorFunction(error);
      });
  };

  /* get all files function section */
  const getFiles = (doc: any) => {
    arrAttachments = doc.target.files;
    for (let i = 0; i < arrAttachments.length; i++) {
      locFileArray.push({
        name: arrAttachments[i].name,
        content: arrAttachments[i],
        Index: i,
      });
    }
  };
  /* function section end */

  /* Life-Cycle function section */
  useEffect(() => {
    setIsLoader(true);
    getDivisionChoice();
  }, []);

  function validateText(text) {
    const letterRegex = /[a-zA-Z]/g;
    const digitRegex = /[0-9]/g;
    const letters = text.match(letterRegex);
    const digits = text.match(digitRegex);
    return letters && digits && letters.length >= 3 && digits.length >= 3;
  }

  function onFormChange(data: ISubHeadShot) {
    var isAttachEmpty = arrAttachments.length;

    if (
      data.Division &&
      data.EmployeeId &&
      isValidCharCode &&
      data.Name &&
      data.ChargeCode &&
      isAttachEmpty !== 0
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }

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
                placeholder={`A&M Email`}
                personSelectionLimit={1}
                showtooltip={true}
                ensureUser={true}
                showHiddenInUI={false}
                principalTypes={[PrincipalType.User]}
                resolveDelay={1000}
                onChange={(e: any) => {
                  if (e.length > 0) {
                    sp.profiles
                      .getUserProfilePropertyFor(e[0].loginName, "SPS-JobTitle")
                      .then((user) => {
                        console.log(user);
                        userMail = [];
                        newRecord.Title = user ? user : "Not Defined";
                        newRecord.Name = e.map((data: any) => {
                          return data.id;
                        })[0];
                        userMail = e.map((data: any) => {
                          let arrUserName: string[] = data.text.split(" ");
                          let arrSplitName: string[] = [];
                          let arrUserNameLength: number =
                            arrUserName.length - 1;
                          arrUserName.forEach((val: string, index: number) => {
                            if (index <= arrUserNameLength) {
                              if (!curUserName) {
                                arrSplitName = val.split(",");
                                curUserName = arrSplitName[0];
                              } else {
                                arrSplitName = val.split(",");
                                curUserName =
                                  curUserName + "_" + arrSplitName[0];
                              }
                            }
                          });
                          return data.secondaryText;
                        });
                        setNewRecord({ ...newRecord });
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  } else {
                    userMail = [];
                    newRecord.Title = "";
                    newRecord.Name = e.map((data: any) => {
                      return data.id;
                    })[0];
                    userMail = e.map((data: any) => {
                      let arrUserName: string[] = data.text.split(" ");
                      let arrSplitName: string[] = [];
                      let arrUserNameLength: number = arrUserName.length - 1;
                      arrUserName.forEach((val: string, index: number) => {
                        if (index <= arrUserNameLength) {
                          if (!curUserName) {
                            arrSplitName = val.split(",");
                            curUserName = arrSplitName[0];
                          } else {
                            arrSplitName = val.split(",");
                            curUserName = curUserName + "_" + arrSplitName[0];
                          }
                        }
                      });
                      return data.secondaryText;
                    });
                    setNewRecord({ ...newRecord });
                  }
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
                placeholder="Please enter Employee ID"
                onChange={(e: any) => {
                  newRecord.EmployeeId = e.target.value;
                  setNewRecord({ ...newRecord });
                  setFolderName(
                    curUserName
                      ? curUserName + "_" + newRecord.EmployeeId
                      : props.currentUser.Title + "_" + newRecord.EmployeeId
                  );
                  onFormChange(newRecord);
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
                  onFormChange(newRecord);
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
                value={newRecord.Title}
                onChange={(e: any) => {
                  newRecord.Title = e.target.value;
                  setNewRecord({ ...newRecord });
                  onFormChange(newRecord);
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
                maxLength={6}
                onBlur={(e: any) => {
                  let result = validateText(e.target.value);
                  if (!result) {
                    alert("Charge Code should be 6 digit alpha numeric value.");
                    setIsValidCharCode(false);
                  } else {
                    setIsValidCharCode(true);
                  }
                }}
                onChange={(e: any) => {
                  newRecord.ChargeCode = e.target.value;
                  setNewRecord({ ...newRecord });
                  onFormChange(newRecord);
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

          {/* SubmittedUser */}

          <div className={styles.FormSec}>
            <Label style={{ width: "18%" }}>SUBMITTER A&M EMAIL:</Label>
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
                  userMail = [];
                  newRecord.SubmitterEmail = e.map((data: any) => {
                    return data.id;
                  })[0];
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
                  setNewRecord({ ...newRecord });
                }}
                // defaultSelectedUsers={
                //   userMail.length > 0 ? userMail : props.currentUser.Email
                // }
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
              <input
                type="file"
                multiple={true}
                onChange={(e: any) => {
                  getFiles(e);
                  onFormChange(newRecord);
                }}
              />
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
            {isLoaders ? (
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
                        cursor: "pointer",
                      }
                }
                onClick={() => {
                  setIsSubmit(false), getCurrentObject();
                }}
              >
                {/* {isSubmit ? "SUBMIT" : "SUBMIT"} */}
                SUBMIT
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SubmitHS;
