import { Button, message, Modal, Popconfirm, Space, Table } from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { Link } from "react-router-dom";
import { removeMovieItem } from "../../../redux/slice/Movie";
import DataTable from "../../../components/admin/Form&Table/Table";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  formatDate,
  convertMovieTime,
  formatDateString,
  formatCurrency,
} from "../../../ultils";
import configRoute from "../../../config";
import { AiOutlineInfoCircle } from "react-icons/ai";
type Props = {};

const ListMovie = (props: Props) => {
  const dispatch = useAppDispatch();
  const { movie, errMess } = useAppSelector((state) => state.movie);
  // const deleteUser = (data: string | undefined) => {
  //   dispatch(removeMovieItem(data))
  //     .unwrap()
  //     .then(() => {
  //       message.success({ content: "Xoá thành công", key: "handling" });
  //     })
  //     .catch(() => {
  //       message.error({ content: { errMess } });
  //     });
  // };
  document.title = "Admin | DS Phim";
  const columnUserList: any = [
    {
      title: "Ảnh",
      dataIndex: "image",
      fixed: "left",
      render: (_: any, { image, _id }: any) => (
        <Link to={_id}>
          {" "}
          <img width="50px" src={image} height="50px" />
        </Link>
      ),
      width: 120,
    },
    {
      title: "Tên",
      dataIndex: "name",
      render: (_: any, { name, _id }: any) => <Link to={_id}>{name}</Link>,
    },

    // {
    //   title: "Thời gian chiếu",
    //   dataIndex: "runTime",
    //   render: (_: any, record: any) => (
    //     <p>{convertMovieTime(record?.runTime)}</p>
    //   ),
    // },

    // {
    //   title: "Độ tuổi",
    //   key: "ageLimit",
    //   render: (_: any, record: any) => (
    //     <div>
    //       <p>{record?.ageLimit}+</p>
    //     </div>
    //   ),
    // },
    {
      title: "Ngày khởi chiếu",
      key: "releaseDate",
      render: (_: any, record: any) => (
        <div>
          <p>{formatDate(record?.releaseDate)}</p>
        </div>
      ),
    },
    {
      title: "Doanh thu",
      key: "profit",
      render: (_: any, record: any) => (
        <div>
          <p>{formatCurrency(record?.profit)}</p>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      render: (item: any, record: any) => (
        <Space size="middle">
          <Link to={`${record._id}`}>
            <EditOutlined
              style={{ color: "var(--primary)", fontSize: "18px" }}
            />
          </Link>
          <AiOutlineInfoCircle
            onClick={() => info(item._id)}
            style={{
              color: "var(--primary)",
              fontSize: "18px,",
              cursor: "pointer",
            }}
          />
          {/* <Popconfirm
            title={`Delete ${record?.name ?? record?._id}?`}
            okText="OK"
            cancelText="Cancel"
            onConfirm={() => deleteUser(record?._id)}
          >
            <DeleteOutlined style={{ color: "red", fontSize: "18px" }} />
          </Popconfirm> */}
          <Button type="dashed" block>
            <Link to={`/admin/showTimes/create?movieId=${record?._id}`}>
              <PlusOutlined
                style={{ color: "var(--primary)", fontSize: "18px" }}
              />
              Tạo suất chiếu
            </Link>
          </Button>
          <Button type="dashed" block>
            <Link to={`/admin/showTimes?movieId=${record?._id}`}>
              Danh sách giờ chiếu
            </Link>
          </Button>
          <Button type="dashed" block>
            <Link to={`/admin/movieComment/${record?._id}`}>
              Đánh giá về phim
            </Link>
          </Button>
        </Space>
      ),
      width: 250,
    },
  ];

  const data: Props[] = movie?.map((item: any, index: any) => {
    return {
      key: index + 1,
      _id: item?._id,
      image: item?.image[0]?.url ?? `${import.meta.env.VITE_HIDDEN_SRC}`,
      name: item?.name,
      actor: item?.actor,
      runTime: item?.runTime,
      releaseDate: item?.releaseDate,
      ageLimit: item?.ageLimit,
      languages: item?.languages,
      country: item?.country,
      director: item?.director,
      description: item?.description,
      status: item?.status,
      profit: item?.profit,
    };
  });
  const info = (id: any) => {
    const movieOne = movie.find((item: any) => item._id === id);

    Modal.info({
      title: `${movieOne?.name} - ( Doanh thu: ${formatCurrency(
        movieOne?.profit
      )})`,
      width: 1000,
      content: (
        <div>
          <div className="grid grid-cols-[30%,70%]">
            <div>
              <img src={movieOne?.image[0]?.url} alt="" width={200} />
            </div>
            <div>
              <p></p>
              <p>
                Loại phim:{" "}
                {movieOne?.movieTypeId?.map(
                  (item: any) => item.movieName + ", "
                )}
              </p>
              <p>Thời lượng: {convertMovieTime(movieOne?.runTime)}</p>
              <p>Diễn viên: {movieOne?.actor}</p>
              <p>Đạo diễn: {movieOne?.director}</p>
              <p>Quốc gia: {movieOne?.country}</p>
              <p>Ngày khởi chiếu: {formatDateString(movieOne?.releaseDate)}</p>
            </div>
          </div>
          <div className="mt-4">{movieOne?.description}</div>
        </div>
      ),
      onOk() {},
    });
  };
  return (
    <div>
      <div className="flex gap-5">
        <Button type="primary" style={{ marginBottom: "20px" }}>
          <Link to="/admin/movies/create">Tạo Phim</Link>
        </Button>
        <Button>
          <Link to={configRoute.routes.adminMovieType}>
            Quản lí thể loại phim
          </Link>
        </Button>
      </div>
      <Table columns={columnUserList} dataSource={data} />
    </div>
  );
};

export default ListMovie;
