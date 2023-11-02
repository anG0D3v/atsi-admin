'use client';
import React, { useCallback, useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { BsFillBoxSeamFill } from 'react-icons/bs';
import { FaUsers } from 'react-icons/fa6';
import { PiSignOutBold } from 'react-icons/pi';
import {
  TbBrandFramerMotion,
  TbCategoryFilled,
  TbWorldWww,
} from 'react-icons/tb';
const { Sider, Header, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } satisfies MenuItem;
}
const items: MenuItem[] = [
  getItem('Brands', '1', <TbBrandFramerMotion />),
  getItem('Categories', '2', <TbCategoryFilled />),
  getItem('Products', '3', <BsFillBoxSeamFill />),
  getItem('Users', '4', <FaUsers />),
  getItem('Web Management', '5', <TbWorldWww />, [
    getItem('Social Media Accounts', '6'),
    getItem('Business Information', '7'),
  ]),
  getItem('Sign Out', '8', <PiSignOutBold />),
];

interface Props {
  children: React.ReactNode;
}
export default function RootLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const onSelectMenu = useCallback((item: any) => {
    console.log(item);
  }, []);
  return (
    <section>
      <Layout className="h-screen">
        <Sider
          collapsible
          className="relative"
          width={250}
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="my-20 text-center">
            <h5 className="text-white">USER ITO</h5>
          </div>
          <Menu
            onClick={(item) => onSelectMenu(item)}
            theme="dark"
            defaultSelectedKeys={['1']}
            mode="inline"
            items={items}
          />
          <div className="absolute bottom-24">
            <h6 className="text-white"> Sign Out</h6>
          </div>
        </Sider>
        <Layout className="bg-[#f5f5f5]">
          <Header className="bg-red-600 p-5" />
          <Content className="p-10">
            <div className="bg-white p-10 min-h-full">{children}</div>
          </Content>
        </Layout>
      </Layout>
    </section>
  );
}
