import * as React from "react";
import {
  Icon,
  Label,
  Dropdown,
  TextField,
  DetailsList,
  SelectionMode,
  Modal,
  Spinner,
} from "@fluentui/react";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import styles from "./CheckHSP.module.scss";
import { useState, useEffect } from "react";
import SPServices from "../SPServices";
import * as moment from "moment";
// import { Dropdown } from "office-ui-fabric-react";
interface IDropdown {
  key: any;
  text: any;
}
const updatavalue = {
  id: null,
  Status: "",
  GoFishDigitalEditor: "",
  index: "",
};
let getData: any[] = [];

const CheckHSP = (props: any): JSX.Element => {
  const [checkprogress, setCheckprogress] = useState(false);
  const [progress, setProgress] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [data, setdata] = useState([]);
  const [ppvalue, setPPvalue] = useState(updatavalue);
  const [choicevalue, setChoicevalue] = useState<IDropdown[]>();
  const [selectedUser, setSelectedUser] = useState(props.currentUser.Id);
  const [btnDisable, setbtnDisbale] = useState(false);
  //column create

  let column = [
    {
      key: "column1",
      name: "UserName",
      fieldName: "UserName",
      minWidth: 250,
      maxWidth: 250,
    },
    {
      key: "column2",
      name: "Status",
      fieldName: "Status",
      minWidth: 250,
      maxWidth: 250,
    },
    {
      key: "column3",
      name: "Headshot Editor",
      fieldName: "GoFishDigitalEditor",
      minWidth: 250,
      maxWidth: 250,
    },
    {
      key: "column4",
      name: "SubmittedOn",
      fieldName: "Created",
      minWidth: 250,
      maxWidth: 250,
    },

    {
      key: "column5",
      name: "Action",
      fieldName: "Action",
      minWidth: 250,
      maxWidth: 250,
      onRender: (item: any, index) => {
        let arrIndex = index;
        return (
          <p style={{ margin: 0 }}>
            <Icon
              style={{ cursor: "pointer" }}
              className={styles.FormIconSec}
              iconName={"edit"}
              onClick={() => {
                setPPvalue({
                  id: item.ID,
                  index: arrIndex,
                  Status: "Received",
                  GoFishDigitalEditor: item.GoFishDigitalEditor,
                });
                setCheckprogress(true);
              }}
            />
          </p>
        );
      },
    },
  ];

  const getErrorFunction = (error: any) => {
    console.log("Error Message : ", error);
  };

  const getDivisionChoice = async () => {
    await SPServices.SPGetChoices({
      Listname: "Headshot",
      FieldName: "Status",
    })
      .then((res: any) => {
        // console.log("res", res);

        let arrDropdown: any[] = [];
        res.Choices.length > 0 &&
          res.Choices.forEach((data: any) => {
            arrDropdown.push({
              key: data,
              text: data,
            });
          });
        setChoicevalue(arrDropdown);
        getDatas(props.currentUser.Id);
      })
      .catch((error: any) => {
        getErrorFunction(error);
      });
  };
  //getdata from headshot
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
      Select: "*,UserName/Title,UserName/EMail",
      Expand: "UserName",
    })
      .then((res: any) => {
        console.log('res',res);
        
        getData = [];
        res.forEach((data) => {
          getData.push({
            Status: data.Status,
            UserName: data.UserNameId ? data.UserName.Title : "",
            ID: data.ID ? data.ID : "",
            Created:data.Created?moment(data.Created).format('MM/DD/YYYY'):null,



            GoFishDigitalEditor: data.GoFishDigitalEditor
              ? data.GoFishDigitalEditor
              : "",
          });
        });
        console.log(getData,'getdata');
        
        setdata([...getData]);
      })
      .catch((error: any) => {
        getErrorFunction(error);
      });
  };

  const updatadata = async () => {
    let res = {
      Status: ppvalue.Status,
      GoFishDigitalEditor: ppvalue.GoFishDigitalEditor,
    };

    data[ppvalue.index].Status = ppvalue.Status;
    data[ppvalue.index].GoFishDigitalEditor = ppvalue.GoFishDigitalEditor;
    setdata([...getData]);
    setCheckprogress(false);
    setIsLoader(true);

    await SPServices.SPUpdateItem({
      Listname: "Headshot",
      ID: ppvalue.id,
      RequestJSON: res,
    })
      .then((res: any) => {
        setIsLoader(false);
        console.log("Upadted");
      })
      .catch(function (error) {
        alert("Something went wrong. Please contact your system admin.");
      });
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
            placeholder={`A&M Email.`}
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
          disabled={btnDisable}
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
          onClick={(e) => {
            getDatas(selectedUser);
            setProgress(true);
          }}
        >
          CHECK PROGRESS
        </button>
      </div>
      {/* status */}
      {progress ? (
        <>
          <DetailsList
            styles={{
              root: {
                selectors: {
                  ".ms-DetailsRow-fields": {
                    maxHeight: 42,
                  },
                },
              },
            }}
            items={data}
            columns={column}
            setKey="key"
            selectionMode={SelectionMode.none}
          />
          {data.length == 0 ? (
            <label className={styles.labelStyle}>No Records Found</label>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}

      <Modal
        isOpen={checkprogress}
        onDismiss={() => setCheckprogress(false)}
        styles={{
          main: {
            width: "30%",
            height: "auto",
          },
        }}
      >
        <div>
          <div
            style={{ display: "flex", justifyContent: "flex-end", margin: 10 }}
          >
            <Icon
              iconName="Cancel"
              style={{ fontSize: 20, cursor: "pointer" }}
              onClick={() => setCheckprogress(false)}
            ></Icon>
          </div>

          <div style={{ padding: "10px 20px" }}>
            <div className={styles.FormSec} style={{ alignItems: "center" }}>
              <Label style={{ width: "40%" }}>
                STATUS <span style={{ color: "red" }}> *</span>
              </Label>
              <p style={{ width: 10 }}>:</p>
              <div style={{ width: "60%" }}>
                <Dropdown
                  // placeholder="Please select value here"
                  options={choicevalue}
                  selectedKey={ppvalue.Status}
                  onChange={(e: any, text: any) => {
                    ppvalue.Status = text.key;
                    setPPvalue({ ...ppvalue });
                  }}

                  // disabled={true}
                />
              </div>
            </div>
            {/* text */}
            <div className={styles.FormSec} style={{ alignItems: "center" }}>
              <Label style={{ width: "40%" }}>
                HEADSHOTEDITOR<span style={{ color: "red" }}> *</span>
              </Label>
              <p style={{ width: 10 }}>:</p>
              <div style={{ width: "60%" }}>
                <TextField
                  value={ppvalue.GoFishDigitalEditor}
                  onChange={(e: any) => {
                    ppvalue.GoFishDigitalEditor = e.target.value;
                    setPPvalue({ ...ppvalue });
                  }}
                />
              </div>
            </div>
            {/* updatebutton */}
            <div className={styles.FormSec} style={{ margin: "16px 0px" }}>
              <div style={{ width: "41.5%" }}></div>
              {isLoader?<Spinner/>:
              <button
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
                onClick={() => updatadata()}
              >
                UPDATE
              </button>
              }
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CheckHSP;
