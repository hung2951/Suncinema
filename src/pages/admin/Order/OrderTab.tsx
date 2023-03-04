import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../../redux/hook';
import OrderTable from './OrderTable';

type Props = {}

const OrderTab = (props: Props) => {
   document.title = "Admin | Orders";
   const { orders } = useAppSelector((state: any) => state.OrderReducer);
   const [orderSuccess, setOrderSuccess] = useState<any[]>([]);
   const [orderFailed, setOrderFailed] = useState<any[]>([]);
   const [orderXuatVe, setOrderXuatVe] = useState<any[]>([]);
   useEffect(() => {
      if (orders) {
         let dataStt0 = orders?.filter((item: any) => item?.status == 0);
         let dataStt2 = orders?.filter((item: any) => item?.status ==2)
         setOrderSuccess(orders?.filter((item: any) => item?.status == 1));
         setOrderFailed([...dataStt0, ...dataStt2]);
         setOrderXuatVe(orders?.filter((item: any) => item?.status == 3))
      }
   }, [orders])
   const items: any[] = [
      {
         key: 1,
         label: `Đơn thanh toán thành công (${orderSuccess?.length})`,
         children: <OrderTable data={orderSuccess} />
      },
      {
         key: 2,
         label: `Đơn thanh toán Lỗi / Chưa thanh toán (${orderFailed?.length}) `,
         children: <OrderTable data={orderFailed} />
      },
      {
         key: 3,
         label: `Đã xuất vé  (${orderXuatVe?.length}) `,
         children: <OrderTable data={orderXuatVe} />
      }
   ]
   return (
      <>
         <Tabs
            defaultActiveKey="1"
            size={"small"}
            style={{ marginBottom: 32 }}
            items={items}
         />
      </>
   )
}

export default OrderTab