import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { Card, Collapse, message, Popconfirm, Table, Tag, Tooltip } from 'antd';
import { Space, Button } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons"
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, formatTime, convertMovieTime } from '../../../ultils'
import configRoute from '../../../config';
import { getAlSt, removeData } from '../../../redux/slice/ShowTimeSlice'
import { useSearchParams } from 'react-router-dom';
import { CaretRightOutlined } from '@ant-design/icons';
import moment from 'moment';
type Props = {}
const { Panel } = Collapse;
const AdminShowTimeList = (props: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = "Admin | Showtime"
    dispatch(getAlSt({}))
    handleSubmit()
  }, [dispatch]);

  const { stList } = useAppSelector((state: any) => state.ShowTimeReducer);
  const { movie } = useAppSelector((state) => state.movie);

  const [showByDate, setShowByDate] = useState([])
  const [searchParams, setSearchParams] = useSearchParams();
  let movieId = searchParams.get("movieId");
  let movieSelect = movie?.find((item: any) => item?._id === movieId);
  const showTimeByMovieId = (stList?.filter((item: any) => item?.movieId?._id === movieId && item?.status == 0));
  console.log('showTimeByMovieId', showTimeByMovieId);

  // get by date
  const handleSubmit = () => {
    const groupByDate = showTimeByMovieId?.reduce((accumulator: any, arrayItem: any) => {
      let rowName = formatDate(arrayItem.date)
      if (accumulator[rowName] == null) {
        accumulator[rowName] = [];
      }
      accumulator[rowName].push(arrayItem);
      return accumulator;
    }, {});
    setShowByDate({ ...groupByDate });

  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: "20px" }}>
        <Link to={`/admin/showTimes/create?movieId=${movieId}`} style={{ color: '#ffff' }}>Create ShowTime</Link>
      </Button>
      <Collapse
        bordered={false}
        defaultActiveKey={['2']}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
      >
        <Panel header="Th??ng tin phim" key="1" className="site-collapse-custom-panel">
          <div className=''>
            <img src={movieSelect?.image[0]?.url} alt="" width="140px" height="140px" />
            <div><b>T??n phim : </b>{movieSelect?.name}</div>
            <div><b>Ng??y kh???i chi???u : </b>{formatDate(movieSelect?.releaseDate)}</div>
            <div><b>Th???i l?????ng : </b>{convertMovieTime(movieSelect?.runTime) + 'h'}</div>
            <div><b>T??n phim : </b>{movieSelect?.name}</div>
          </div>
        </Panel>
        <Panel header="Th??ng tin su???t chi???u" key="2" className="site-collapse-custom-panel">
          {showTimeByMovieId ? showTimeByMovieId?.map((item: any) => (
            <Card key={item?._id}  >
              <h1>Ng??y chi???u : {formatDate(item?.date)}</h1>
              <div>Gi??? chi???u : {formatTime(item?.startAt)} - {formatTime(item?.endAt)}</div>
              <div>Ph??ng chi???u :
                {item?.roomId?.map((roomItem: any) => (
                  <Button key={roomItem?._id}>
                    <Link to={`/book-chair?room=${roomItem?._id}&showtime=${item?._id}`}>
                      {roomItem?.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </Card>
          )) : (
            <>
              <p>Ch??a c?? su???t chi???u n??o</p>
            </>
          )}
          {/* {renderShowByDate()} */}
        </Panel>
      </Collapse>

    </div>
  )
}

export default AdminShowTimeList