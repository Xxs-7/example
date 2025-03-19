import { useState } from "react";
import {
  Layout,
  Switch,
  Space,
  Button,
  Input,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  TimePicker,
  Form,
  InputNumber,
  Slider,
  Rate,
  Upload,
  Progress,
  Tag,
  Avatar,
  Badge,
  Alert,
  Spin,
  Tooltip,
  Divider,
  Card,
  List,
  Table,
  Tabs,
  Modal,
  message,
} from "antd";
import { ConfigProvider } from "antd";
import { UploadOutlined, UserOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import { lightTheme, darkTheme } from "./theme/themeConfig";
import "./App.css";
import { SwitchProps } from "antd/es/switch";

const { Header, Content } = Layout;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => setIsModalOpen(true);
  const handleModalOk = () => {
    setIsModalOpen(false);
    messageApi.success("操作成功！");
  };

  /**
   * 切换主题色，扩散渐变动画
   * @param event 点击事件
   */
  const handleThemeChange: SwitchProps["onChange"] = (checked: boolean, event) => {
    // 必须加这句
    document.documentElement.className = checked ? "dark" : "light";

    console.log(event);
    // 获取点击位置，或者键盘切换时则回退到页面中间
    const x = (event as React.MouseEvent).clientX || innerWidth / 2;
    const y = (event as React.MouseEvent).clientY || innerWidth / 2;

    // 获取到最远角的距离
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const circlePath = [`circle(0 at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

    // 执行主题切换
    const transition = document.startViewTransition(() => {
      setIsDarkMode(checked);
    });

    // 监听过渡动画的就绪状态
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: checked ? circlePath : [...circlePath].reverse(),
        },
        {
          duration: 1000,
          easing: "ease-in",
          pseudoElement: checked ? "::view-transition-new(root)" : "::view-transition-old(root)",
        }
      );
    });
  };

  const demoList = [
    { title: "列表项 1", description: "这是第一个列表项的描述" },
    { title: "列表项 2", description: "这是第二个列表项的描述" },
  ];

  const tableData = [
    { key: "1", name: "张三", age: 32, address: "北京市" },
    { key: "2", name: "李四", age: 42, address: "上海市" },
  ];

  const tableColumns = [
    { title: "姓名", dataIndex: "name", key: "name" },
    { title: "年龄", dataIndex: "age", key: "age" },
    { title: "地址", dataIndex: "address", key: "address" },
  ];

  return (
    <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme || {}}>
      <Layout className='layout'>
        <Header style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 20px" }}>
          <Space>
            <SunOutlined />
            <Switch checked={isDarkMode} onClick={handleThemeChange} checkedChildren='🌙' unCheckedChildren='☀️' />
            <MoonOutlined />
          </Space>
        </Header>
        <Content style={{ padding: "20px 50px" }}>
          {contextHolder}
          <div className='component-section'>
            <h2>基础组件</h2>
            <Space direction='vertical' size='large' style={{ width: "100%" }}>
              <Card title='按钮与输入框'>
                <Space wrap>
                  <Button type='primary'>主按钮</Button>
                  <Button>次按钮</Button>
                  <Input placeholder='基本输入框' style={{ width: 200 }} />
                  <InputNumber placeholder='数字输入框' />
                </Space>
              </Card>

              <Card title='选择器'>
                <Space wrap>
                  <Select
                    defaultValue='option1'
                    style={{ width: 120 }}
                    options={[
                      { value: "option1", label: "选项一" },
                      { value: "option2", label: "选项二" },
                    ]}
                  />
                  <Radio.Group defaultValue='a'>
                    <Radio value='a'>选项A</Radio>
                    <Radio value='b'>选项B</Radio>
                  </Radio.Group>
                  <Checkbox>复选框</Checkbox>
                </Space>
              </Card>

              <Card title='日期和时间'>
                <Space wrap>
                  <DatePicker />
                  <TimePicker />
                </Space>
              </Card>

              <Card title='表单'>
                <Form layout='inline'>
                  <Form.Item label='用户名'>
                    <Input placeholder='请输入用户名' />
                  </Form.Item>
                  <Form.Item label='密码'>
                    <Input.Password placeholder='请输入密码' />
                  </Form.Item>
                </Form>
              </Card>

              <Card title='滑块与评分'>
                <Space direction='vertical' style={{ width: "100%" }}>
                  <Slider defaultValue={30} />
                  <Rate defaultValue={2.5} allowHalf />
                </Space>
              </Card>

              <Card title='上传与进度'>
                <Space direction='vertical' style={{ width: "100%" }}>
                  <Upload>
                    <Button icon={<UploadOutlined />}>点击上传</Button>
                  </Upload>
                  <Progress percent={70} />
                </Space>
              </Card>

              <Card title='标签与头像'>
                <Space wrap>
                  <Tag color='blue'>标签</Tag>
                  <Avatar icon={<UserOutlined />} />
                  <Badge count={5}>
                    <Avatar shape='square' icon={<UserOutlined />} />
                  </Badge>
                </Space>
              </Card>

              <Card title='提示信息'>
                <Space direction='vertical' style={{ width: "100%" }}>
                  <Alert message='Success Tips' type='success' showIcon />
                  <br />
                  <Alert message='Informational Notes' type='info' showIcon />
                  <br />
                  <Alert message='Warning' type='warning' showIcon closable />
                  <br />
                  <Alert message='Error' type='error' showIcon />
                  <br />
                  <Spin />
                  <Tooltip title='提示文字'>
                    <Button>鼠标悬停</Button>
                  </Tooltip>
                </Space>
              </Card>

              <Divider>分割线</Divider>

              <Card title='列表与表格'>
                <Space direction='vertical' style={{ width: "100%" }}>
                  <List
                    bordered
                    dataSource={demoList}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta title={item.title} description={item.description} />
                      </List.Item>
                    )}
                  />
                  <Table columns={tableColumns} dataSource={tableData} />
                </Space>
              </Card>

              <Card title='标签页'>
                <Tabs
                  defaultActiveKey='1'
                  items={[
                    { key: "1", label: "标签1", children: "标签1内容" },
                    { key: "2", label: "标签2", children: "标签2内容" },
                  ]}
                />
              </Card>

              <Card title='对话框'>
                <Button type='primary' onClick={showModal}>
                  打开对话框
                </Button>
                <Modal
                  title='对话框标题'
                  open={isModalOpen}
                  onOk={handleModalOk}
                  onCancel={() => setIsModalOpen(false)}
                >
                  <p>这是一个对话框示例</p>
                </Modal>
              </Card>
            </Space>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
