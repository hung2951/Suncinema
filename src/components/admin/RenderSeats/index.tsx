import { Button, Col, Form, message, Modal, Row, Select, Space, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { getOneSBSTById } from "../../../redux/slice/SeatBySTSlice";
import { updateSeatThunk } from "../../../redux/slice/SeatSlice";
import { defaultStatus } from "../../../ultils/data";
import styles from "../Form&Table/room.module.scss";
import { validateMessages } from "../../../ultils/FormMessage";
import { CloseOutlined, FormOutlined, EditOutlined } from '@ant-design/icons';
import { IoApps, IoCreateOutline } from 'react-icons/io5';
type Props = {
  row?: any;
  column?: any;
  seatDetails?: any;
  setSeatDetails?: any;
  setSeatFile?: any;
  seatFile?: any;
  seats?: any;
  setSeats?: any;
  roomId?: any;
  showTable?: any;
};
const { Option } = Select;
const RenderSeats = ({
  row,
  column,
  seats,
  setSeats,
  seatDetails,
  setSeatDetails,
  seatFile,
  roomId,
  showTable,
  setSeatFile
}: Props) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [seatArr, setSeatArr] = useState<any>([]);
  const [seatArrSelect, setSeatArrSelect] = useState<any>([]);
  const [optionsStatus, setOptionsStatus] = useState();
  const [optionsSeatTpe, setOptionsSeatTpe] = useState();
  const { seatType } = useAppSelector((state) => state.seatTypeReducer);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    handleSubmit();
  }, [seats]);

  useEffect(() => {
    getInfoSelectFromTable();
  }, [selectedRowKeys]);

  const getClassNameForSeats = (seatValue: any) => {
    let dynamicClass;
    if (seatValue == 0) {
      // Not booked
      dynamicClass = styles.seatNotBooked;
    } else if (seatValue == 1 || seatValue == null) {
      // booked
      dynamicClass = styles.seatBlocked;
    } else if (seatValue == 2) {
      // Seat Selected
      dynamicClass = styles.seatSelected;
    }
    return `${styles.seats} ${dynamicClass}`;
  };

  const groupBy = (data: any) => {
    const groupByRowName = data?.reduce((accumulator: any, arrayItem: any) => {
      let rowName = arrayItem.row;
      if (accumulator[rowName] == null) {
        accumulator[rowName] = [];
      }
      accumulator[rowName].push(arrayItem);
      return accumulator;
    }, {});
    return groupByRowName;
  };

  const handleSubmit = () => {
    if (seats) {
      let groupItem = groupBy(seats);
      setSeatDetails({ ...groupItem });
    }
  };

  const onSeatClick = (seatValue: any, rowIndex: any, key: any) => {
    let item = JSON.parse(JSON.stringify(seatValue));
    if (item?.status === 1 || item?.status == null) {
      return;
    } else if (item?.status === 0) {
      item["status"] = 2;
    } else if (item?.status === 2) {
      item["status"] = 0;
    }
    seatDetails[key][rowIndex] = { ...item };
    setSeatDetails({ ...seatDetails });
    let flatern = findSelectSeat();
    setSeatArr(flatern);
  };

  const findSelectSeat = () => {
    let arr: any = [];
    for (const key in seatDetails) {
      let colVal = seatDetails[key]?.filter(
        (seatVal: any) => seatVal?.status == 2
      );
      arr = [...arr, colVal];
    }
    const flatten = arr.reduce((a: any, b: any) => {
      return a.concat(b);
    });
    return flatten;
  };

  const info = (val: any) => {
    Modal.info({
      title: `Seat infomation`,
      content: (
        <div>
          <div>Id : {val?._id}</div>
          <div>
            Loại ghế:
            <Select
              value={val?.seatTypeId?.name}
              onChange={(value: any) => {
                changeSeatType(val?._id, value);
              }}
            >
              {seatType?.map((item: any) => (
                <Option value={item?._id} key={item?._id}>
                  {item?.name}
                </Option>
              ))}
            </Select>
          </div>
          <div>Vị trí ghế: {val.row + val.column}</div>
          <div>
            Trạng thái ghế:
            <Select
              value={val.status === 0 ? "Hoạt động" : "Dừng hoạt động"}
              onChange={(value: any) => {
                changeStatusSeat(val?._id, value);
              }}
            >
              {defaultStatus?.map((item: any) => (
                <Option value={item?._id} key={item?.value}>
                  {item?.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      ),
      onOk() { },
    });
  };
  const changeStatusSeat = (id: any, val: number) => {
    const upload = { seatId: [id], status: Number(val), roomId: roomId };
    dispatch(updateSeatThunk(upload))
      .unwrap()
      .then((pl: any) => {
        dispatch(getOneSBSTById(roomId));
        setIsModalOpen(false);
        message.success("Thay đổi trạng thái thành công");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err: any) => message.error(err));
  };

  const changeSeatType = (id: any, val: any) => {
    const payload = { seatId: [id], seatTypeId: val, roomId: roomId };
    dispatch(updateSeatThunk(payload))
      .unwrap()
      .then(() => {
        dispatch(getOneSBSTById(roomId));
        message.success("Thay đổi loại ghế thành công");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error: any) => message.error(error));
  };
  const RenderSeatsContain = () => {
    let seatArray: any[] = [];
    for (let key in seatDetails) {
      let colValue = seatDetails[key]?.map((seatValue: any, rowIndex: any) => (
        <span key={`${key}.${rowIndex}`} className={styles.seatsHolder}>
          {rowIndex === 0 && <span className={styles.colNameAd}>{key}</span>}
          {rowIndex === 0 && <span className={styles.colNameAd2}>{key}</span>}
          <span
            className={getClassNameForSeats(seatValue?.status)}
            style={{ backgroundColor: `${seatValue?.seatTypeId?.color}` }}
            onClick={() => {
              onSeatClick(seatValue, rowIndex, key);
            }}
            onDoubleClick={() => {
              info(seatValue);
            }}
          >
            {rowIndex + 1}
          </span>

          {seatDetails && rowIndex === seatDetails[key].length - 1 && (
            <>
              <br />
              <br />
            </>
          )}
        </span>
      ));
      seatArray.push(colValue);
    }
    return <div className={styles.seatsLeafContainer}>{seatArray}</div>;
  };

  //table
  const columns: any[] = [
    { title: "STT", dataIndex: "key" },
    { title: "position", dataIndex: "position", render: (_: any, { position }: any) => <b>{position}</b> },
    { title: "_id", dataIndex: "_id" },
  ];
  const data: any[] = seatArr?.map((item: any, index: any) => {
    return {
      key: index + 1,
      position: `${item?.row}${item?.column}`,
      _id: item?._id,
    };
  });

  const onSelectChange = (newSelectedRowKeys: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const getInfoSelectFromTable = () => {
    if (selectedRowKeys) {
      let arrToUpdate = seatArr?.filter((item: any, index: any) =>
        selectedRowKeys.includes(index + 1)
      );
      setSeatArrSelect(arrToUpdate);
    }
  };

  const chooseAllSeat = () => {
    const handleChooseAll = () => {
      let cloneArr: any[] = JSON.parse(JSON.stringify(seats));
      cloneArr?.map((val: any) => (val["status"] = 2));
      let redc = [...cloneArr];
      let groupItem = groupBy(redc);
      setSeatDetails({ ...groupItem });
      setSeatArrSelect({ ...groupItem });
      setSeatArr(redc);
    };

    const handleChooseAllExit = () => {
      handleSubmit();
      setSeatArr([]);
    };

    return (
      <div className="m-3  flex gap-3">
        <Button type="primary" onClick={handleChooseAll} icon={<IoApps />} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 3 }}>
          Chọn tất cả
        </Button>
        {seatArr?.length > 0 && (
          <Button onClick={handleChooseAllExit} icon={<CloseOutlined />} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 3 }}>Bỏ chọn</Button>
        )}
      </div>
    );
  };
  const onReset = () => {
    form.resetFields();
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const renderChoice = () => {
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const onFinish = (val: any) => {
      const payload = {
        status: Number(val?.status),
        seatTypeId: val?.seatTypeId,
        seatId: [...seatArrSelect],
        roomId: seatArr[0]?.roomId,
      };
      dispatch(updateSeatThunk(payload))
        .unwrap()
        .then(() => {
          onReset();
          message.success("Update thành công");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch((error: any) => {
          setSeatArr([]);
          setSelectedRowKeys([]);
          setSeatArrSelect([]);
          message.error(error);
          handleSubmit();
          onReset();
        });
    };

    const getStatusChoice = (val: any) => {
      setOptionsStatus(val);
    };
    const getSeatTypeChoice = (val: any) => {
      setOptionsSeatTpe(val);
    };
    const getAllSeatChosing = () => {
      let indexKey = seatArr?.map((item: any, index: any) => index + 1);
      setSelectedRowKeys(indexKey);
    };
    const ExitAllSeatChosing = () => {
      setSelectedRowKeys([]);
    };
    return (
      <>
        <Space.Compact block >
          <Tooltip title=" Chọn tất cả ghế trong bảng">
            <Button onClick={getAllSeatChosing} icon={<IoApps />} className={styles.renderBtnIcon}  >  </Button>
          </Tooltip>
          <Tooltip title="Bỏ chọn">
            <Button onClick={ExitAllSeatChosing} icon={<CloseOutlined />} className={styles.renderBtnIcon}>
            </Button>
          </Tooltip>
          <Tooltip title="Chọn nội dung thay đổi" >
            <Button onClick={showModal} icon={<IoCreateOutline />} className={styles.renderBtnIcon}> </Button>
          </Tooltip>
        </Space.Compact>
        <Modal
          title="Thay đổi thông tin ghế"
          open={isModalOpen}
          onCancel={handleCancel}
          okButtonProps={{ style: { display: "none" } }}
        >
          <Form
            onFinish={onFinish}
            form={form}
            layout="horizontal"
            validateMessages={validateMessages}
          >
            <Form.Item
              label="Trạng thái ghế"
              name="status"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Vui lòng chọn trạng thái ghế"
                onChange={(value: any) => getStatusChoice(value)}
              >
                {defaultStatus?.map((item: any) => (
                  <Option value={item?._id} key={item?.value}>
                    {item?.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label=" Loại ghế:"
              name="seatTypeId"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Vui lòng chọn loại ghế"
                onChange={(value: any) => getSeatTypeChoice(value)}
              >
                {seatType?.map((item: any) => (
                  <Option value={item?.value} key={item?._id}>
                    {item?.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginTop: "20px" }}
            >
              Cập nhật thông tin ghế
            </Button>
          </Form>
        </Modal>
      </>
    );
  };
  const renderSeatClick = () => {
    return (
      <div className="w-full mt-3">
        {selectedRowKeys.length >= 1 && (
          <div className="flex gap-3">{renderChoice()}</div>
        )}
        <div style={{ width: "100%" }}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <Row gutter={30}>
        <Col flex="auto">{chooseAllSeat()}{RenderSeatsContain()}</Col>
        <Col flex="400px">{seatArr?.length > 0 && <>{renderSeatClick()}</>}</Col>
      </Row>
    </div>
  );
};

export default RenderSeats;
