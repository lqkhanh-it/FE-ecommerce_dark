import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import DashboardSpecifications from "./DashboardSpecifications";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateFromHTML } from "draft-js-import-html";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

export default function DashboardProductEdit(props) {
  const createForm = useRef();
  const cateInput = useRef();
  const groupCateInput = useRef();
  const [isCheckedSmall, setIsCheckedSmall] = useState(false);
  const [isCheckedMedium, setIsCheckedMedium] = useState(false);
  const [isCheckedLarge, setIsCheckedLarge] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [cate, setCate] = useState([]);
  const [file, setFile] = useState([]);
  const [newsContent, setNewsContent] = useState("");
  const product = props.product;

  const [productImg, setProductImg] = useState([]);
  const [productName, setProductName] = useState("");
  const [productSale, setProductSale] = useState(0);
  const [productPrice, setProductPrice] = useState(0);
  const [productDes, setProductDes] = useState("");
  const [productCate, setProductCate] = useState("");
  const [productGroupCate, setProductGroupCate] = useState("");
  const [productGroupCateList, setProductGroupCateList] = useState([]);
  const [productSize, setProductSize] = useState([]);
  const [productType, setProductType] = useState([]);

  const checkedSize = (event) => {
    if (event.target.id === "1") {
      if (isCheckedSmall) {
        const size = productSize.filter((item) => {
          return item !== "Small";
        });
        setProductSize(size);
        setIsCheckedSmall(false);
      } else {
        setProductSize((productSize) => [...productSize, "Small"]);
        setIsCheckedSmall(true);
      }
    }
    if (event.target.id === "2") {
      if (isCheckedMedium) {
        const size = productSize.filter((item) => {
          return item !== "Medium";
        });
        setProductSize(size);
        setIsCheckedMedium(false);
      } else {
        setProductSize((productSize) => [...productSize, "Medium"]);
        setIsCheckedMedium(true);
      }
    }
    if (event.target.id === "3") {
      const size = productSize.filter((item) => {
        return item !== "Large";
      });
      setProductSize(size);
      if (isCheckedLarge) {
        setIsCheckedLarge(false);
      } else {
        setProductSize((productSize) => [...productSize, "Large"]);
        setIsCheckedLarge(true);
      }
    }
  };

  const handleOnChange = (event) => {
    setInputValue({ ...inputValue, [event.target.name]: event.target.value });
  };
  let specifications = "";
  useEffect(() => {
    if (product) {
      if (product.productSpec !== undefined) {
        for (let i in Object.keys(product.productSpec)) {
          specifications += `<p>${Object.keys(product.productSpec)[i]}: ${
            Object.values(product.productSpec)[i]
          }</p>\n`;
        }
      }

      setNewsContent(specifications);
      setProductName(product.productName);
      setProductImg(product.productImg);
      setProductSale(product.productSale);
      setProductPrice(product.productPrice);
      setProductDes(product.productDes);
      setProductCate(product.productCate);
      setProductType(product.productType);
      setProductSize(product.productSize);
      setProductGroupCate(product.productGroupCate);

      axios.get(`http://localhost:4000/category`).then((res) => {
        setCate(res.data);
        const test = Object.values(
          res.data.reduce((a, { groupCate }) => {
            a[groupCate] = a[groupCate] || { groupCate };
            return a;
          }, Object.create(null))
        );
        setProductGroupCateList(res.data);
      });
      axios.get(`http://localhost:4000/products`).then((res) => {
        const test = Object.values(
          res.data.reduce((a, { productGroupCate }) => {
            a[productGroupCate] = a[productGroupCate] || { productGroupCate };
            return a;
          }, Object.create(null))
        );
        setProductGroupCateList(test);
      });
    }
  }, [product]);
  const onSubmit = (event) => {
    event.preventDefault();
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    const objSpec = {};
    newsContent
      .replaceAll("<p>", " ")
      .replaceAll("\n", "")
      .split("</p>")
      .forEach((item) => {
        objSpec[item.slice(0, item.indexOf(":")).replaceAll(" ", "")] =
          item.slice(item.indexOf(":") + 1);
      });
    const imageArr = Array.from(file);
    imageArr.forEach((image) => {
      formData.append("productImg", image);
    });

    formData.append("productName", productName);
    formData.append("productSale", productSale);
    formData.append("productPrice", productPrice);
    formData.append("productCate", productCate);
    formData.append("productGroupCate", productGroupCate);
    // formData.append("productSize", productSize);
    formData.append("productSpec", JSON.stringify(objSpec));
    formData.append("productDes", productDes);
    formData.append("productType", "Phone");
    formData.append("productDate", new Date());
    axios
      .post(
        `http://localhost:4000/products/update/${product._id}`,
        formData,
        config
      )
      .then(() => {
        props.setCloseEditFunc(false);
        props.setToastFunc(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNewCate = () => {
    axios.post("http://localhost:4000/category", {
      cateName: inputValue.cate,
      groupCate: productGroupCate,
    });
    setCate((cate) => [
      ...cate,
      { cateName: inputValue.cate, groupCate: productGroupCate },
    ]);
    setProductCate(inputValue.cate);
    cateInput.current.value = "";
  };

  const addNewGroupCate = () => {
    setProductGroupCate(inputValue.groupCate);
    setProductGroupCateList((productGroupCateList) => [
      ...productGroupCateList,
      { groupCate: inputValue.groupCate },
    ]);
    groupCateInput.current.value = "";
  };
  const deleteImg = (event) => {
    const id = event.target.id;
    const virutalFile = [...file];
    virutalFile.splice(id, 1);
    setFile(virutalFile);
    const items = [...productImg];
    items.splice(id, 1);
    setProductImg(items);
    axios.post(`http://localhost:4000/products/update/${product._id}`, {
      deleteImgId: id,
    });
  };

  return (
    <div className="DashboardProductInfo">
      <div className="create-box">
        <div className="create-box-title flex">
          <div className="create-box-title-text">Product infomation</div>
          <div
            className="create-box-title-close flex-center"
            onClick={() => {
              props.setCloseEditFunc(false);
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
        {product && (
          <form
            onSubmit={onSubmit}
            encType="multipart/form-data"
            ref={createForm}
          >
            <div className="create-box-row flex">
              <div className="dashboard-left flex">Name</div>
              <div className="dashboard-right">
                <input
                  type="text"
                  name="name"
                  value={productName}
                  onChange={(event) => {
                    setProductName(event.target.value);
                  }}
                  required
                ></input>
              </div>
            </div>
            <div className="create-box-row flex">
              <div className="dashboard-left flex">Images </div>
              <div className="dashboard-right">
                <input
                  onChange={(event) => {
                    const files = event.target.files;
                    for (let i = 0; i < files.length; i++) {
                      setProductImg((product) => [
                        ...product,
                        URL.createObjectURL(files[i]),
                      ]);
                    }
                    const fileArr = Array.prototype.slice.call(files);
                    fileArr.forEach((item) => {
                      console.log(file);
                      setFile((file) => [...file, item]);
                    });
                  }}
                  type="file"
                  name="productImg"
                  className="noborder"
                  multiple="multiple"
                  style={{ height: "50px" }}
                ></input>
                <div
                  className="flex"
                  style={{ overflowY: "hidden", flexWrap: "wrap" }}
                >
                  {productImg &&
                    productImg.map((item, index) => {
                      return (
                        <div className="create-box-img">
                          <img
                            key={index}
                            src={
                              item.slice(0, 4) != "blob"
                                ? "data:image/png;base64," + item
                                : item
                            }
                            alt=""
                          ></img>
                          <div className="create-box-img-overlay">
                            <p id={index} onClick={deleteImg} className="icon">
                              X
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            <div className="create-box-row flex">
              <div className="dashboard-left flex">Defaut price </div>
              <div className="dashboard-right">
                <input
                  type="number"
                  name="price"
                  placeholder="USD"
                  value={productPrice}
                  onChange={(event) => {
                    setProductPrice(event.target.value);
                  }}
                  required
                ></input>
              </div>
            </div>
            <div className="create-box-row flex">
              <div className="dashboard-left flex">Sale off </div>
              <div className="dashboard-right flex-center">
                <input
                  type="number"
                  placeholder="%"
                  style={{ width: "100px" }}
                  name="sale"
                  value={productSale}
                  onChange={(event) => {
                    setProductSale(event.target.value);
                  }}
                  required
                ></input>
                <label>From: </label>
                <input
                  type="date"
                  name="fromdate"
                  onChange={handleOnChange}
                  placeholder="dd/mm/yyyy"
                  pattern="(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)"
                />
                <label>To: </label>
                <input
                  type="date"
                  name="todate"
                  onChange={handleOnChange}
                  placeholder="dd/mm/yyyy"
                  pattern="(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)"
                />
              </div>
            </div>
            <div className="create-box-row flex">
              <div className="dashboard-left flex">Category group</div>
              <div className="dashboard-right flex-center">
                <select
                  style={{ width: "350px" }}
                  onChange={(event) => {
                    setProductGroupCate(event.target.value);
                  }}
                  value={productGroupCate}
                >
                  <option></option>
                  {productGroupCateList.length > 0 &&
                    productGroupCateList.map((item, index) => {
                      return <option key={index}>{item.groupCate}</option>;
                    })}
                </select>
                <input
                  type="text"
                  name="groupCate"
                  placeholder="New category group?"
                  style={{ margin: "0 10px" }}
                  onChange={handleOnChange}
                  ref={groupCateInput}
                ></input>
                <div
                  className="btn"
                  style={{
                    fontSize: "14px",
                    fontFamily: "sans-serif",
                    fontWeight: "300",
                    padding: "0 10px",
                    cursor: "pointer",
                    width: "350px",
                    height: "30px",
                  }}
                  onClick={addNewGroupCate}
                >
                  Add
                </div>
              </div>
            </div>
            <div className="create-box-row flex">
              <div className="dashboard-left flex">Category </div>
              <div className="dashboard-right flex-center">
                <select
                  style={{ width: "350px" }}
                  onChange={(event) => {
                    setProductCate(event.target.value);
                  }}
                  value={productCate}
                >
                  <option></option>
                  {cate.length > 0 &&
                    cate.map((item, index) => {
                      if (item.groupCate == productGroupCate) {
                        return <option key={index}>{item.cateName}</option>;
                      }
                    })}
                </select>
                <input
                  type="text"
                  name="cate"
                  placeholder="New category?"
                  style={{ margin: "0 10px" }}
                  onChange={handleOnChange}
                  ref={cateInput}
                ></input>
                <div
                  className="btn"
                  style={{
                    fontSize: "14px",
                    fontFamily: "sans-serif",
                    fontWeight: "300",
                    padding: "0 10px",
                    cursor: "pointer",
                    width: "350px",
                    height: "30px",
                  }}
                  onClick={addNewCate}
                >
                  Add
                </div>
              </div>
            </div>
            <div className="create-box-row flex">
              <div className="dashboard-left flex">Specifications </div>
              <div className="dashboard-right">
                <DashboardSpecifications
                  setNewsContent={setNewsContent}
                  newsContent={newsContent}
                ></DashboardSpecifications>
              </div>
            </div>
            <div className="create-box-row flex">
              <div className="dashboard-left flex">Description </div>
              <div className="dashboard-right">
                <input
                  type="text"
                  name="des"
                  value={productDes || ""}
                  onChange={(event) => {
                    setProductDes(event.target.value);
                  }}
                  required
                ></input>
              </div>
            </div>

            <div className="flex-center" style={{ marginTop: "40px" }}>
              <button className="create-box-btn btn">Update product</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
