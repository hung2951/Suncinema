import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SlideShow from "../../../components/client/SlideShow/SlideShow";
import styles from "./Home.module.scss";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { useAppSelector, useAppDispatch } from "../../../redux/hook";
import { convertDateToNumber, formatDate } from "../../../ultils";
import moment from "moment";
import Voucher from "../../../components/client/voucher";
import { getAlVc } from "../../../redux/slice/voucherSlice";
import NewsContent from "../../../components/client/NewsContent";
import News from "../News/News";
import { Spin } from "antd"

type Props = {};

const Home = (props: Props) => {
  useEffect(() => { document.title = "Trang chủ"; }, [])
  const [isAcive, setActive] = useState(1);
  const { slider, isErr, isFetching, isSucess } = useAppSelector(
    (state) => state.slider
  );
  const Toggle = (number: number) => {
    setActive(number);
  };
  const { movie } = useAppSelector((state: any) => state.movie);
  let dateToday = Date.now();
  //  convert date to number
  let data = movie.map((item: any) => {
    return (item = {
      ...item,
      releaseDate: convertDateToNumber(item.releaseDate),
    });
  });
  const data1 = data.filter((item: any) => item.releaseDate <= dateToday);
  const data2 = data.filter((item: any) => item.releaseDate > dateToday);
  return (
    <>
      {isFetching ? <Spin size="large" /> : <SlideShow slider={slider} />}
      <div className={styles.content}>
        <div className={styles.content_btn}>
          <button
            onClick={() => Toggle(1)}
            className={isAcive == 1 ? styles.content_btn_active : ""}
          >
            Phim đang chiếu
          </button>
          <button
            onClick={() => Toggle(2)}
            className={isAcive == 2 ? styles.content_btn_active : ""}
          >
            Phim sắp chiếu
          </button>
        </div>
        {/* Home Page 1 */}
        <div className={isAcive == 1 ? styles.content_btn1 : "hidden"}>
          <div className={styles.content_list}>
            {data1?.map((item: any) => (
              <div className={styles.content_list_item} key={item._id}>
                <Link to={item.slug}>
                  <div className={styles.content_list_item_img}>
                    <img
                      src={
                        item?.image[0]?.url ??
                        `${import.meta.env.VITE_HIDDEN_SRC}`
                      }
                      alt=""
                    />
                  </div>
                  <div className={styles.content_list_item_info}>
                    <h3>{item.name}</h3>
                    <p>
                      Thể loại:{" "}
                      {item.movieTypeId?.map((x: any) => x.movieName + ", ")}
                    </p>
                    <p>Khởi chiếu: {formatDate(item.releaseDate)}</p>
                    <button>Đặt vé</button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        {/* End Home Page 1 */}

        {/* Home page 2 */}
        <div className={isAcive == 2 ? styles.content_btn2 : "hidden"}>
          <div className={styles.content_list}>
            {data2?.map((item: any) => (
              <div className={styles.content_list_item} key={item._id}>
                <Link to={item.slug}>
                  <div className={styles.content_list_item_img}>
                    <img
                      src={
                        item?.image[0]?.url ??
                        `${import.meta.env.VITE_HIDDEN_SRC}`
                      }
                      alt=""
                    />
                  </div>
                  <div className={styles.content_list_item_info}>
                    <h3>{item.name}</h3>
                    <p>
                      Thể loại:{" "}
                      {item.movieTypeId?.map((x: any) => x.movieName + ", ")}
                    </p>
                    <p>Khởi chiếu: {formatDate(item.releaseDate)}</p>
                    <button>Đặt vé</button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        {/* End Home Page 2 */}

        <Link to={`#`}>
          <div className={styles.more}>
            <p>Xem thêm</p>
            <span>
              <HiOutlineArrowNarrowRight />
            </span>
          </div>
        </Link>

        <div className={styles.content_news_cmt}>
          <div className={styles.content_news}>
            <h3>Tin tức</h3>
            <News activeNav={true} />
          </div>

          {/* <div className={styles.content_cmt}>
            <h3>Bình luận phim</h3>
          </div> */}
        </div>

        <div className={styles.content_news_cmt}>
          <div className={styles.content_news}>
            <h3>Khuyến mãi mới</h3>
            <Voucher activeNav={true} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
