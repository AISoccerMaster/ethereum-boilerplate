import { Card, Timeline, Typography, Modal, Button, Form, Input, Checkbox, Skeleton, Tooltip, Image } from "antd";
import { FileSearchOutlined, SendOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import React, { useMemo, useState } from "react";
import { useMoralis, useNFTBalances } from "react-moralis";
import AddressInput from "./AddressInput";
import { getExplorer } from "helpers/networks";

// import program from "../contracts/Program.json";

// const ProgramContractAddr = '0x939cEc587C391Fa17ddbaFc7577e115e6AAD8E74';

const { Meta } = Card;
const { Text } = Typography;

const styles = {
  title: {
    fontSize: "20px",
    fontWeight: "700",
  },
  text: {
    fontSize: "16px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "0.5rem",
  },
  timeline: {
    marginBottom: "-45px",
  },
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    width: "100%",
    gap: "10px",
  },
};

export default function QuickStart({ isServerInfo }) {
  const { data: ProgramNFTs } = useNFTBalances({address: "0x939cEc587C391Fa17ddbaFc7577e115e6AAD8E74"});
  const { Moralis, chainId } = useMoralis();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUseNFTHeadIcon, setIsUseNFTHeadIcon] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
  const [visible, setVisibility] = useState(false);
  const [receiverToSend, setReceiver] = useState(null);
  const [amountToSend, setAmount] = useState(null);
  const [nftToSend, setNftToSend] = useState(null);
  const [isPending, setIsPending] = useState(false);

  useMemo(() => (Moralis.Plugins?.oneInch ? true : false), [Moralis.Plugins?.oneInch]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    console.log('Success:', values, NFTContract);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleTransferClick = (nft) => {
    setNftToSend(nft);
    setVisibility(true);
  };

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  async function transfer(nft, amount, receiver) {
    const options = {
      type: nft.contract_type,
      tokenId: nft.token_id,
      receiver: receiver,
      contractAddress: nft.token_address,
    };

    if (options.type === "erc1155") {
      options.amount = amount;
    }

    setIsPending(true);
    await Moralis.transfer(options)
      .then((tx) => {
        console.log(tx);
        setIsPending(false);
      })
      .catch((e) => {
        alert(e.message);
        setIsPending(false);
      });
  }

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <Card
        style={styles.card}
        title={
          <>
            📝 <Text strong>Developer</Text>
          </>
        }
      >
        <Timeline mode="left" style={styles.timeline}>
          <Timeline.Item dot="📄">
            <Text style={styles.text}>
              Register to be a developer{" "}
              <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Register
              </Button>
              <Modal title="Register Developer" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form
                  name="basic"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Decription"
                    name="Decription"
                    rules={[{ required: true, message: 'Please input your decription for yourself!' }]}
                  >
                    <Input placeholder="< 200 bytes" />
                  </Form.Item>

                  <Form.Item      
                    label="Use NFT HeadIcon"
                    name="HeadIconNFTCheck"
                    rules={[{ required: false, message: 'Please select whether use NFT head icon!' }]}
                  >
                    <Checkbox onChange={(e) => setIsUseNFTHeadIcon(e.target.checked)}></Checkbox>
                  </Form.Item>
                  {
                    isUseNFTHeadIcon ?
                      <div>
                        <Form.Item                
                          label="HeadIconNFT"
                          name="HeadIconNFT"
                          rules={[{ required: true, message: 'Please input the contract address of your head icon!' }]}
                        >
                          <AddressInput autoFocus placeholder="NFT contract address" onChange={setNFTContract} />
                        </Form.Item>

                        <Form.Item
                          label="TokenId"
                          name="TokenId"
                          rules={[{ required: true, message: 'Please input the token id of your head icon!' }]}
                        >
                          <Input />
                        </Form.Item>
                      </div>
                      :
                      <div>
                        <Form.Item
                          label="HeadIconURL"
                          name="HeadIcon"
                          rules={[{ required: true, message: 'Please input URL of your head icon!' }]}
                        >
                          <Input />
                        </Form.Item>
                      </div>
                  }

                  <Form.Item
                    label="Github"
                    name="Github"
                    rules={[{ required: true, message: 'Please input your github reposit page url!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Form>
              </Modal>
            </Text>
          </Timeline.Item>

          <Timeline.Item dot="💿">
            <Text style={styles.text}>
              Launch your AI program{" "}
              <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Launch
              </Button>
            </Text>
          </Timeline.Item>

          <Timeline.Item dot="🧰">
            <Text style={styles.text}>
              Create your robot{" "}
              <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Create
              </Button>
            </Text>
          </Timeline.Item>

          <Timeline.Item dot="💾">
            <Text style={styles.text}>
              Bind your program to robot{" "}
              <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Bind
              </Button>
            </Text>
          </Timeline.Item>

          <Timeline.Item dot="🔏">
            <Text style={styles.text}>
              Join the competition robot list{" "}
              <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Join
              </Button>
            </Text>     
          </Timeline.Item>

          <Timeline.Item dot="🔁">
            <Text style={{ display: "block" }}>
              Challenge other robots{" "}
              <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Challenge
              </Button>
            </Text>            
          </Timeline.Item>

          <Timeline.Item dot="🚀">
            <Text style={styles.text}>BUIDL!!!</Text>
          </Timeline.Item>
        </Timeline>
      </Card>
      <div>
        <Card
          style={styles.card}
          title={
            <>
              💣 <Text strong>My Programs</Text>
            </>
          }
        >
          <div style={styles.NFTs}>
            <Skeleton loading={!ProgramNFTs?.result}>
              {ProgramNFTs?.result &&
                ProgramNFTs.result.map((nft, index) => {
                  const imgData = JSON.parse(nft.metadata)?.image;
                  return (
                    <Card
                      hoverable
                      actions={[
                        <Tooltip title="View On Blockexplorer">
                            <FileSearchOutlined
                            onClick={() => window.open(`${getExplorer(chainId)}address/${nft.token_address}`, "_blank")}
                          />
                        </Tooltip>,
                        <Tooltip title="Transfer NFT">
                          <SendOutlined onClick={() => handleTransferClick(nft)} />
                        </Tooltip>,
                        <Tooltip title="Sell On OpenSea">
                          <ShoppingCartOutlined onClick={() => alert("OPENSEA INTEGRATION COMING!")} />
                        </Tooltip>,
                      ]}
                      style={{ width: 240, border: "2px solid #e7eaf3" }}
                      cover={
                        <Image
                          preview={false}
                          src={imgData}
                          fallback="data:image/png;base64,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"
                          alt=""
                          style={{ height: "300px" }}
                        />
                      }
                      key={index}
                    >
                      <Meta title={"ERC1155#" + nft.token_id + '[' + nft.totalSupply + ']'} description={nft.token_address} />
                    </Card>
                  );
                })}
              </Skeleton>
              <Modal
                title={`Transfer ${nftToSend?.name || "NFT"}`}
                visible={visible}
                onCancel={() => setVisibility(false)}
                onOk={() => transfer(nftToSend, amountToSend, receiverToSend)}
                confirmLoading={isPending}
                okText="Send"
              >
                <AddressInput autoFocus placeholder="Receiver" onChange={setReceiver} />
                {nftToSend && nftToSend.contract_type === "erc1155" && (
                  <Input placeholder="amount to send" onChange={(e) => handleChange(e)} />
                )}
              </Modal>    
            </div>
        </Card>
        <Card
          style={{ marginTop: "10px", ...styles.card }}
          title={
            <>
              📡 <Text strong> My Robots</Text>
            </>
          }
        >
          
        </Card>
      </div>
      <div>
        <Card
          style={styles.card}
          title={
            <>
              💣 <Text strong>My Competitions</Text>
            </>
          }
        >
          
        </Card>
      </div>
    </div>
  );
}
