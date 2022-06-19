import React, { useEffect, useState } from "react";
import "../App.css";
import Newsletter from "../components/Layouts/Newsletter.js";
import Footer from "../components/Layouts/Footer.js";
import BannerV2 from "../components/Banner/BannerV2.js";
import Header from "../components/Header/Header.js";
import ShopBody from "../components/Shop/ShopBody";
import bg from "../assets/S4.jpg";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { abort } from "process";

function Shop(props) {
  const [products, setProducts] = useState([]);
  const [sortedCate, setSortedCate] = useState([]);
  const [productGroupCateList, setProductGroupCateList] = useState([]);
  let type = props.location.pathname.split("/")[1];
  let cate = props.location.pathname.split("/")[2];
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "unset";
  }, []);

  useEffect(() => {
    if (type === "shop") {
      axios.get(`http://localhost:4000/products`).then((res) => {
        const virtualCate = [...res.data];
        //Get all category
        const sortedcate = Object.values(
          virtualCate.reduce((a, { productCate }) => {
            a[productCate] = a[productCate] || { productCate, count: 0 };
            a[productCate].count++;
            return a;
          }, Object.create(null))
        );
        //Sort and splice category by posts count
        sortedcate.sort((a, b) => b.count - a.count);
        setSortedCate(sortedcate);
        const virtualData = [];
        for (let i in res.data) {
          if (cate) {
            if (
              res.data[i].productName.toLowerCase().includes(cate.toLowerCase())
            ) {
              virtualData.push(res.data[i]);
            }
          } else {
            virtualData.push(res.data[i]);
          }
        }
        setProducts(virtualData);
      });
    } else {
      axios.get(`http://localhost:4000/products`).then((res) => {
        const grCateList = Object.values(
          res.data.reduce((a, { productGroupCate }) => {
            a[productGroupCate] = a[productGroupCate] || { productGroupCate };
            return a;
          }, Object.create(null))
        );

        for (let i in grCateList) {
          grCateList[i] = grCateList[i].productGroupCate;
        }
        const virtualCate = [];
        if (grCateList.includes(cate)) {
          for (let i in res.data) {
            if (res.data[i].productGroupCate == cate) {
              virtualCate.push(res.data[i]);
            }
          }
        } else {
          for (let i in res.data) {
            virtualCate.push(res.data[i]);
          }
        }

        //Get all category
        const sortedcate = Object.values(
          virtualCate.reduce((a, { productCate }) => {
            a[productCate] = a[productCate] || { productCate, count: 0 };
            a[productCate].count++;
            return a;
          }, Object.create(null))
        );
        //Sort and splice category by posts count
        sortedcate.sort((a, b) => b.count - a.count);
        setSortedCate(sortedcate);

        const virtualData = [];
        if (grCateList.includes(cate)) {
          for (let i in res.data) {
            if (cate) {
              if (res.data[i].productGroupCate.includes(cate)) {
                virtualData.push(res.data[i]);
              }
            } else {
              virtualData.push(res.data[i]);
            }
          }
        } else {
          for (let i in res.data) {
            if (!cate) {
              if (res.data[i].productType.toLowerCase() === type) {
                virtualData.push(res.data[i]);
              }
            } else {
              if (
                res.data[i].productType === type &&
                cate &&
                res.data[i].productGroupCate
                  .toLowerCase()
                  .split(" ")
                  .join("-") === cate
              ) {
                virtualData.push(res.data[i]);
              } else if (
                res.data[i].productType.toLowerCase() === type &&
                cate &&
                res.data[i].productCate.toLowerCase().split(" ").join("-") ===
                  cate
              ) {
                virtualData.push(res.data[i]);
              }
            }
          }
        }
        setProducts(virtualData);
      });
    }
  }, []);

  return (
    <div className="Men">
      <Header />
      <BannerV2 bannerImage={bg} position={"0"} />
      <ShopBody products={products} sortedCate={sortedCate} />
      <Newsletter />
      <Footer />
    </div>
  );
}
export default withRouter(Shop);
