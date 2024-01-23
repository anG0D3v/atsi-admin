'use client';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { BsFillBoxSeamFill } from 'react-icons/bs';
import { FaUsers } from 'react-icons/fa6';
import { PiSignOutBold } from 'react-icons/pi';
import { TbBrandFramerMotion, TbCategoryFilled } from 'react-icons/tb';
import { CustomAvatar, CustomLabel } from '@/components';
import { Routes } from '@/config/routes/routes';
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
  // getItem('Dashboard', '0', <BiSolidDashboard />),
  getItem('Brands', '0', <TbBrandFramerMotion />),
  getItem('Categories', '1', <TbCategoryFilled />),
  getItem('Products', '2', <BsFillBoxSeamFill />),
  getItem('Users', '3', <FaUsers />),
  // getItem('Web Management', '4', <TbWorldWww />, [
  //   getItem('Social Media Accounts', '5'),
  //   getItem('Business Information', '6'),
  // ]),
  getItem('Sign Out', '4', <PiSignOutBold />),
];

interface Props {
  children: React.ReactNode;
}
export default function RootLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const [currentPathname, setCurrentPathname] = useState<string>('');
  const navigate = useRouter();

  useLayoutEffect(() => {
    setCurrentPathname(pathname);
  }, [pathname]);

  const onSelectMenu = useCallback((item: any) => {
    switch (item?.key) {
      case '0':
        navigate.push(Routes.Brands);
        break;
      case '1':
        navigate.push(Routes.Categories);
        break;
      case '2':
        navigate.push(Routes.Products);
        break;
      case '3':
        navigate.push(Routes.Users);
        break;
    }
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
          <div className="p-3 text-left flex flex-col items-center justify-center space-y-5">
            <CustomAvatar
              size={collapsed ? 60 : 100}
              alt="profile"
              classes="border border-2 border-white mt-5"
              url="https://file.xunruicms.com/admin_html/assets/pages/media/profile/profile_user.jpg"
            />
            {!collapsed && (
              <div className="w-full flex flex-col items-center justify-center">
                <CustomLabel
                  variant="text"
                  children="Welcome,"
                  classes="text-white text-left  text-sm"
                />
                <CustomLabel
                  variant="text"
                  children="John Doe"
                  classes="text-white font-semibold text-2xl m-0 p-0"
                />
              </div>
            )}
          </div>
          <div className="p-3">
            <Menu
              onClick={(item) => onSelectMenu(item)}
              theme="dark"
              selectedKeys={[
                currentPathname === Routes.Categories
                  ? '1'
                  : currentPathname === Routes.Brands
                  ? '0'
                  : currentPathname === Routes.Products
                  ? '2'
                  : '0',
              ]}
              mode="inline"
              items={items}
            />
          </div>
        </Sider>
        <Layout className="bg-[#f5f5f5]">
          <Header className="drop-shadow-md bg-white p-5" />
          <Content className="p-10">
            <div className="bg-white p-10 min-h-full">{children}</div>
          </Content>
        </Layout>
      </Layout>
    </section>
  );
}
