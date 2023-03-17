import * as React from "react";
import {
  Icon,
  Label,
  Dropdown,
  TextField,
  DetailsList,
  SelectionMode,
  Modal,
} from "@fluentui/react";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import styles from "./CheckHSP.module.scss";
import { useState, useEffect } from "react";
import SPServices from "../SPServices";
// import { Dropdown } from "office-ui-fabric-react";
interface IDropdown {
  key: any;
  text: any;
}
const updatavalue = {
  id: null,
  Status: "",
  GoFishDigitalEditor: "",
};
let getData: any[] = [];

const CheckHSP = (props: any): JSX.Element => {
  const [checkprogress, setCheckprogress] = useState(false);
  const [progress, setProgress] = useState(false);
  const [data, setdata] = useState([]);
  const [ppvalue, setPPvalue] = useState(updatavalue);
  const [choicevalue, setChoicevalue] = useState<IDropdown[]>();

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
      key: "column5",
      name: "Action",
      fieldName: "Action",
      minWidth: 250,
      maxWidth: 250,
      onRender: (item: any) => {
        console.log("item", item);

        return (
          <p>
            <Icon
              className={styles.FormIconSec}
              iconName={"edit"}
              onClick={() => {
                setPPvalue({
                  id: item.ID,
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
        getDatas();
      })
      .catch((error: any) => {
        getErrorFunction(error);
      });
  };
  //getdata from headshot
  const getDatas = async () => {
    await SPServices.SPReadItems({
      Listname: "Headshot",
      Filter: [
        {
          FilterKey: "UserName",
          FilterValue: props.currentUser.Id,
          Operator: "eq",
        },
      ],
      Select: "*,UserName/Title,UserName/EMail",
      Expand: "UserName",
    }).then((res: any) => {
      console.log(res, "res");

      getData = [];
      res.forEach((data) => {
        getData.push({
          Status: data.Status,
          UserName: data.UserNameId ? data.UserName.Title : "",
          ID: data.ID ? data.ID : "",
          GoFishDigitalEditor: data.GoFishDigitalEditor
            ? data.GoFishDigitalEditor
            : "",
        });
      });
      setdata(getData);
    });
  };
  const updatadata = async () => {
    let res = {
      Status: ppvalue.Status,
      GoFishDigitalEditor: ppvalue.GoFishDigitalEditor,
    };
    await SPServices.SPUpdateItem({
      Listname: "Headshot",
      ID: ppvalue.id,
      RequestJSON: res,
    }).then((res: any) => setCheckprogress(false));
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
          onClick={() => setProgress(true)}
        >
          CHECK PROGRESS
        </button>
      </div>
      {/* status */}
      {progress ? (
        <>
          <DetailsList
            items={data}
            columns={column}
            setKey="key"
            selectionMode={SelectionMode.none}
          />
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
              style={{ fontSize: 20 ,cursor:"pointer"}}
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
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CheckHSP;
