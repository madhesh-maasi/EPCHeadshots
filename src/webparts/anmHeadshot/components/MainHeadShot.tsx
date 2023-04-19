import * as React from "react";
import {
  Icon,
  Label,
  Dropdown,
  IDropdownStyles,
  ICheckboxStyles,
  Spinner,
  NormalPeoplePicker,
  Checkbox,
  DatePicker,
} from "@fluentui/react";
import SubmitHS from "./SubmitHeadshot/SubmitHS";
import CheckHSP from "./CheckHeadshotProgress/CheckHSP";
import RetrieveHS from "./RetrieveHeadshot/RetrieveHS";
import SubmitHSQ from "./SubmitHeadshotQuestion/SubmitHSQ";
import styles from "./AnmHeadshot.module.scss";
import { useState, useEffect } from "react";
import { sp } from "@pnp/sp/presets/all";

interface IProp {
  sp: any;
  context: any;
  ListName: string;
  LibraryName: string;
}

interface INavigate {
  SubmitHS: boolean;
  CheckHSP: boolean;
  RetrieveHS: boolean;
  SubmitHSQ: boolean;
  RAG: boolean;
  ER: boolean;
  HQ: boolean;
}

interface ICurUser {
  Id: number;
  Email: string[];
  Name: string;
  Title: string;
  JobTitle: string;
}

let Owners: any[] = [];
let isOwners: boolean = false;
let _naveSH: string = "submitheadshot";
let _naveCHP: string = "checkheadshot";
let _naveRH: string = "retrieveheadshot";
let _naveSHQ: string = "otherquestion";

const MainHeadShot = (props: IProp): JSX.Element => {
  /* Local variable section start */
  let urlParams: any = new URLSearchParams(window.location.search);
  let pageURLContion: string = urlParams.get("Disp");
  let pageName: string = pageURLContion ? pageURLContion.toLowerCase() : "";

  let isNavigate: INavigate = {
    SubmitHS: pageName == _naveSH ? true : false,
    CheckHSP: pageName == _naveCHP ? true : false,
    RetrieveHS: pageName == _naveRH ? true : false,
    SubmitHSQ: pageName == _naveSHQ ? true : false,
    RAG: false,
    ER: false,
    HQ: false,
  };

  let currentUserDetails: ICurUser = {
    Id: null,
    Email: [],
    Name: "",
    Title: "",
    JobTitle: "",
  };
  /* Local variable section end */

  /* State create section start */
  const [isOverAllNavigate, setIsOverAllNavigate] =
    useState<INavigate>(isNavigate);
  const [currentUser, setCurrentUser] = useState<ICurUser>(null);
  /* State create section end */

  /* Functions create section start */
  /* Error function */
  const getErrorFunction = (errMSG: any) => {
    console.log("Error Message : ", errMSG);
  };

  /* Home page function section */
  const getHomePage = () => {
    setIsOverAllNavigate({
      SubmitHS: false,
      CheckHSP: false,
      RetrieveHS: false,
      SubmitHSQ: false,
      RAG: false,
      ER: false,
      HQ: false,
    });
  };

  // get group owners
  const getGroupowners = async () => {
    await props.sp.web.siteGroups
      .getByName("Marketing Owners")
      .users.get()
      .then((users: any) => {
        Owners = [];
        users.length > 0 && users.forEach((user: any) => Owners.push(user.Id));
        getCurrentUser();
      })
      .catch((error: any) => {
        getErrorFunction(error);
      });
  };

  /* Current User function */
  const getCurrentUser = async () => {
    await props.sp.web.currentUser
      .get()
      .then((data: any) => {
        // let curUserName: string = "";
        // let arrUserName: string[] = data.Title.split(" ");
        // let arrSplitName: string[] = [];
        // let arrUserNameLength: number = arrUserName.length - 1;
        // arrUserName.forEach((val: string, index: number) => {
        //   if (index <= arrUserNameLength) {
        //     if (!curUserName) {
        //       arrSplitName = val.split(",");
        //       curUserName = arrSplitName[0];
        //     } else {
        //       arrSplitName = val.split(",");
        //       curUserName = curUserName + "_" + arrSplitName[0];
        //     }
        //   }
        // });
        // data
        //   ? setCurrentUser({
        //       Id: data.Id,
        //       Email: [data.Email],
        //       Name: data.Title,
        //       Title: curUserName,
        //       JobTitle: "Not Defined",
        //     })
        //   : setCurrentUser({ ...currentUserDetails });
        isOwners = Owners.some((e: number) => e == data.Id);
        sp.profiles
          .getUserProfilePropertyFor(data.LoginName, "SPS-JobTitle")
          .then((res) => {
            let curUserName: string = "";
            let arrUserName: string[] = data.Title.split(" ");
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
            data
              ? setCurrentUser({
                  Id: data.Id,
                  Email: [data.Email],
                  Name: data.Title,
                  Title: curUserName,
                  JobTitle: res ? res : "Not Defined",
                })
              : setCurrentUser({ ...currentUserDetails });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error: any) => {
        getErrorFunction(error);
      });
  };
  /* Functions create section end */

  /* useEffect Section */
  useEffect(() => {
    getGroupowners();
  }, []);

  return (
    currentUser && (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div>
          {/* Label section start */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px 0px",
            }}
          >
            <Label style={{ fontSize: "32px" }}>
              Headshot Submission and Repository
            </Label>
          </div>
          {/* Label section end */}

          {/* Card section start */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              margin: "60px 0px",
            }}
          >
            {/* Submit Headshot section */}
            <div
              className={styles.cardSec}
              style={
                isOverAllNavigate.SubmitHS
                  ? { background: "#ffff" }
                  : { background: "#002649" }
              }
              onClick={() => {
                if (!isOverAllNavigate.SubmitHS) {
                  setIsOverAllNavigate({
                    SubmitHS: true,
                    CheckHSP: false,
                    RetrieveHS: false,
                    SubmitHSQ: false,
                    RAG: false,
                    ER: false,
                    HQ: false,
                  });
                } else {
                  setIsOverAllNavigate({
                    SubmitHS: false,
                    CheckHSP: false,
                    RetrieveHS: false,
                    SubmitHSQ: false,
                    RAG: false,
                    ER: false,
                    HQ: false,
                  });
                }
              }}
            >
              <div>
                <Icon
                  iconName="Save"
                  className={styles.cardIconSec}
                  style={
                    isOverAllNavigate.SubmitHS
                      ? { color: "#000" }
                      : { color: "#ffff" }
                  }
                />
                <Label
                  style={
                    isOverAllNavigate.SubmitHS
                      ? { color: "#000" }
                      : { color: "#ffff" }
                  }
                >
                  Submit Headshot
                </Label>
              </div>
            </div>

            {/* Check Headshot Progress section */}
            <div
              className={styles.cardSec}
              style={
                isOverAllNavigate.CheckHSP
                  ? { background: "#ffff" }
                  : { background: "#002649" }
              }
              onClick={() => {
                if (!isOverAllNavigate.CheckHSP) {
                  setIsOverAllNavigate({
                    SubmitHS: false,
                    CheckHSP: true,
                    RetrieveHS: false,
                    SubmitHSQ: false,
                    RAG: false,
                    ER: false,
                    HQ: false,
                  });
                } else {
                  setIsOverAllNavigate({
                    SubmitHS: false,
                    CheckHSP: false,
                    RetrieveHS: false,
                    SubmitHSQ: false,
                    RAG: false,
                    ER: false,
                    HQ: false,
                  });
                }
              }}
            >
              <div>
                <Icon
                  iconName="SyncOccurence"
                  className={styles.cardIconSec}
                  style={
                    isOverAllNavigate.CheckHSP
                      ? { color: "#000" }
                      : { color: "#ffff" }
                  }
                />
                <Label
                  style={
                    isOverAllNavigate.CheckHSP
                      ? { color: "#000" }
                      : { color: "#ffff" }
                  }
                >
                  Check Headshot Progress
                </Label>
              </div>
            </div>

            {/* Retrieve Headshot section */}
            <div
              className={styles.cardSec}
              style={
                isOverAllNavigate.RetrieveHS
                  ? { background: "#ffff" }
                  : { background: "#002649" }
              }
              onClick={() => {
                if (!isOverAllNavigate.RetrieveHS) {
                  setIsOverAllNavigate({
                    SubmitHS: false,
                    CheckHSP: false,
                    RetrieveHS: true,
                    SubmitHSQ: false,
                    RAG: false,
                    ER: false,
                    HQ: false,
                  });
                } else {
                  setIsOverAllNavigate({
                    SubmitHS: false,
                    CheckHSP: false,
                    RetrieveHS: false,
                    SubmitHSQ: false,
                    RAG: false,
                    ER: false,
                    HQ: false,
                  });
                }
              }}
            >
              <div>
                <Icon
                  iconName="Search"
                  className={styles.cardIconSec}
                  style={
                    isOverAllNavigate.RetrieveHS
                      ? { color: "#000" }
                      : { color: "#ffff" }
                  }
                />
                <Label
                  style={
                    isOverAllNavigate.RetrieveHS
                      ? { color: "#000" }
                      : { color: "#ffff" }
                  }
                >
                  Retrieve Headshot
                </Label>
              </div>
            </div>

            {/* Submit Headshot Question section */}
            <div
              className={styles.cardSec}
              style={
                isOverAllNavigate.SubmitHSQ
                  ? { background: "#ffff" }
                  : { background: "#002649" }
              }
              onClick={() => {
                if (!isOverAllNavigate.SubmitHSQ) {
                  setIsOverAllNavigate({
                    SubmitHS: false,
                    CheckHSP: false,
                    RetrieveHS: false,
                    SubmitHSQ: true,
                    RAG: false,
                    ER: false,
                    HQ: false,
                  });
                } else {
                  setIsOverAllNavigate({
                    SubmitHS: false,
                    CheckHSP: false,
                    RetrieveHS: false,
                    SubmitHSQ: false,
                    RAG: false,
                    ER: false,
                    HQ: false,
                  });
                }
              }}
            >
              <div>
                <Icon
                  iconName="Save"
                  className={styles.cardIconSec}
                  style={
                    isOverAllNavigate.SubmitHSQ
                      ? { color: "#000" }
                      : { color: "#ffff" }
                  }
                />
                <Label
                  style={
                    isOverAllNavigate.SubmitHSQ
                      ? { color: "#000" }
                      : { color: "#ffff" }
                  }
                >
                  Submit Headshot Question
                </Label>
              </div>
            </div>

            {/* Resources and Guidelines section */}
            <div
              className={styles.cardSec}
              style={
                isOverAllNavigate.RAG
                  ? { background: "#ffff" }
                  : { background: "#002649" }
              }
              onClick={() => {
                if (!isOverAllNavigate.RAG) {
                  window.open(
                    "https://itinfoalvarezandmarsal.sharepoint.com/sites/Marketing/SitePages/Headshot%20Submission%20and%20Retrieval.aspx"
                  );
                  setIsOverAllNavigate({
                    SubmitHS: false,
                    CheckHSP: false,
                    RetrieveHS: false,
                    SubmitHSQ: false,
                    RAG: true,
                    ER: false,
                    HQ: false,
                  });
                } else {
                  setIsOverAllNavigate({
                    SubmitHS: false,
                    CheckHSP: false,
                    RetrieveHS: false,
                    SubmitHSQ: false,
                    RAG: false,
                    ER: false,
                    HQ: false,
                  });
                }
              }}
            >
              <div>
                <Icon
                  iconName="EntitlementRedemption"
                  className={styles.cardIconSec}
                  style={
                    isOverAllNavigate.RAG
                      ? { color: "#000" }
                      : { color: "#ffff" }
                  }
                />
                <Label
                  style={
                    isOverAllNavigate.RAG
                      ? { color: "#000" }
                      : { color: "#ffff" }
                  }
                >
                  Resources and Guidelines
                </Label>
              </div>
            </div>

            {false && (
              <>
                {/* Editor Repository link */}
                <div
                  className={styles.cardSec}
                  style={
                    isOverAllNavigate.ER
                      ? { background: "#ffff" }
                      : { background: "#002649" }
                  }
                  onClick={() => {
                    if (!isOverAllNavigate.ER) {
                      window.open(
                        "https://itinfoalvarezandmarsal.sharepoint.com/sites/Marketing/HeadshotAttachments/Forms/AllItems.aspx"
                      );
                      setIsOverAllNavigate({
                        SubmitHS: false,
                        CheckHSP: false,
                        RetrieveHS: false,
                        SubmitHSQ: false,
                        RAG: false,
                        ER: true,
                        HQ: false,
                      });
                    } else {
                      setIsOverAllNavigate({
                        SubmitHS: false,
                        CheckHSP: false,
                        RetrieveHS: false,
                        SubmitHSQ: false,
                        RAG: false,
                        ER: false,
                        HQ: false,
                      });
                    }
                  }}
                >
                  <div>
                    <Icon
                      iconName="EntitlementRedemption"
                      className={styles.cardIconSec}
                      style={
                        isOverAllNavigate.ER
                          ? { color: "#000" }
                          : { color: "#ffff" }
                      }
                    />
                    <Label
                      style={
                        isOverAllNavigate.ER
                          ? { color: "#000" }
                          : { color: "#ffff" }
                      }
                    >
                      Editor Repository
                    </Label>
                  </div>
                </div>

                {/* Headshot questions */}
                <div
                  className={styles.cardSec}
                  style={
                    isOverAllNavigate.HQ
                      ? { background: "#ffff" }
                      : { background: "#002649" }
                  }
                  onClick={() => {
                    if (!isOverAllNavigate.HQ) {
                      window.open(
                        "https://itinfoalvarezandmarsal.sharepoint.com/sites/Marketing/Lists/Questions/AllItems.aspx"
                      );
                      setIsOverAllNavigate({
                        SubmitHS: false,
                        CheckHSP: false,
                        RetrieveHS: false,
                        SubmitHSQ: false,
                        RAG: false,
                        ER: false,
                        HQ: true,
                      });
                    } else {
                      setIsOverAllNavigate({
                        SubmitHS: false,
                        CheckHSP: false,
                        RetrieveHS: false,
                        SubmitHSQ: false,
                        RAG: false,
                        ER: false,
                        HQ: false,
                      });
                    }
                  }}
                >
                  <div>
                    <Icon
                      iconName="EntitlementRedemption"
                      className={styles.cardIconSec}
                      style={
                        isOverAllNavigate.HQ
                          ? { color: "#000" }
                          : { color: "#ffff" }
                      }
                    />
                    <Label
                      style={
                        isOverAllNavigate.HQ
                          ? { color: "#000" }
                          : { color: "#ffff" }
                      }
                    >
                      Headshot questions
                    </Label>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Card section end */}

          {/* Navigation section start */}
          <div>
            {isOverAllNavigate.SubmitHS && (
              <SubmitHS
                sp={props.sp}
                context={props.context}
                currentUser={currentUser}
                ListName={props.ListName}
                LibraryName={props.LibraryName}
                homePage={getHomePage}
              />
            )}

            {isOverAllNavigate.CheckHSP && (
              <CheckHSP
                sp={props.sp}
                context={props.context}
                currentUser={currentUser}
                ListName={props.ListName}
                LibraryName={props.LibraryName}
                homePage={getHomePage}
              />
            )}

            {isOverAllNavigate.RetrieveHS && (
              <RetrieveHS
                sp={props.sp}
                context={props.context}
                currentUser={currentUser}
                ListName={props.ListName}
                LibraryName={props.LibraryName}
                homePage={getHomePage}
              />
            )}

            {isOverAllNavigate.SubmitHSQ && (
              <SubmitHSQ
                sp={props.sp}
                context={props.context}
                currentUser={currentUser}
                ListName={props.ListName}
                LibraryName={props.LibraryName}
                homePage={getHomePage}
              />
            )}
          </div>
          {/* Navigation section end */}
        </div>
      </div>
    )
  );
};

export default MainHeadShot;
