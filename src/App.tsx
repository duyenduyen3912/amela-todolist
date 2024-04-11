import {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {CloseOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons"
import { TableColumnsType, Table, TableProps, Button, Checkbox, Form, type FormProps, Input, message } from 'antd';
import Select from 'antd/es/select';
import type { SearchProps } from 'antd/es/input/Search';
import moment from 'moment';
const { Search } = Input;

interface  DataType{
  key: React.Key
  title: string;
  content: string;
  date: string;
  status: string;
  id:string
}


function App() {
  const [isOpen , setIsOpen] = useState(false)
  const [data, setData] = useState<DataType[]>([])
  const [form] = Form.useForm()
  const handleOpenForm = () => {
    if(isOpen) setIsOpen(false)
    else setIsOpen(true)
  }
  const handleDeleteTask = (id: string) => {
    const index = data.findIndex(obj => obj.id === id)
    if(index != -1){
      data.splice(index, 1)
      localStorage.setItem("data", JSON.stringify(data))
      message.success("Xoá thành công!")
      setTimeout(()=>{
        window.location.reload()
      }, 1200)
    } else message.error("Có lỗi xảy ra vui lòng thử lại sau!")
  }
  const handleEditTask = (id: string) => {
      const index = data.findIndex(obj =>  obj.id === id)
      if(!isOpen) setIsOpen(true)
      form.setFieldsValue(data[index]);
    }
  const onFinish: FormProps<DataType>["onFinish"] = (values) => {
    if(values.id) {
      const newData = data.map((item, index) => {
          if(item.id === values.id) return  values
          else return item
      })
      localStorage.setItem("data", JSON.stringify(newData))
      setData(newData)
      message.success("Sửa task thành công!")
    } else {
      const id = moment().format('YYYYMMDDHHmmss');
      const newValue = {...values, id: id }
      localStorage.setItem("data", JSON.stringify([...data, newValue]))
      setData([...data, newValue])
    }
    form.resetFields()
  };
  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    const searchValue = value.toLowerCase()
    const newData = data.filter((item, index) => {
      const value = item.content.toLowerCase()
      if(value.includes(searchValue)) return item
    })
    if(newData.length !== 0) {
      setData(newData)
    } else{
      setData([])
      message.error("Không có dữ liệu!")
      setTimeout(() => {
        window.location.reload()
      }, 1200)
    } 
  };
  useEffect(() => {
    const getData = localStorage.getItem("data") 
    if(getData){
      const data = JSON.parse(getData)
      setData(data)
    } 
  }, [])
  
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      width: '20%',
      filters: [
        {
          text: 'Học',
          value: 'Học'
        },
        {
          text: 'Nhà',
          value: 'Nhà'
        },
      ],
      onFilter: (value, record) => record.title.includes(value as string)
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      width: '30%',
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'date',
      width: '20%',
      sorter: (a, b) => {
        const dateA: any = new Date(a.date)
        const dateB: any = new Date(b.date)
        return dateA - dateB
      },
      render: (value, record) => <span>{moment(value).format("DD/MM/YYYY")}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      filters: [
        {
          text: 'Open',
          value: 'open',
        },
        {
          text: 'Inprogress',
          value: 'inprogress',
        },
        {
          text: 'Resolve',
          value: 'resolve',
        },
      ],
      onFilter: (value, record) => record.status.startsWith(value as string),
      width: '10%',
    },
    {
      title:"Action",
      width: '10%',
      render: (value, record) => <span><EditOutlined onClick={() => handleEditTask(record.id)} className='icon' /><DeleteOutlined onClick={() => handleDeleteTask(record.id)} className='icon' /></span>
    }
  ];
  return (
    <div className='app'>
      <div className='search'> 
        <Search
          placeholder="Tìm kiếm công việc theo nội dung"
          allowClear
          enterButton="Search"
          size="middle"
          onSearch={onSearch}
          style={{ width: 304 }}
        />
        {isOpen ? <div onClick={handleOpenForm}><CloseOutlined /></div> : <Button onClick={handleOpenForm}>Thêm mới</Button>}
        
      </div>
      <Table columns={columns} dataSource={data} className='table'/>
      {
        isOpen && 
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
          autoComplete="off"
          className='form'
          
        >
          <Form.Item<DataType>
            name="id"
          >
          </Form.Item>
          <Form.Item<DataType>
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Nhập tiêu đề công việc!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: 'Nhập nội dung công việc!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<DataType>
            label="Ngày thực hiện"
            name="date"
            rules={[{ required: true, message: 'Nhập ngày thực hiện!' }]}
          >
            <Input type='date'/>
          </Form.Item>
          <Form.Item<DataType>
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Lựa chọn trạng thái!' }]}
          >
            <Select>
              <Select.Option value="open">Open</Select.Option>
              <Select.Option value="inprogress">Inprogress</Select.Option>
              <Select.Option value="resolve">Resolve</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      }
    </div>
  );
}

export default App;
