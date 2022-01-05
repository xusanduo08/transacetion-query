import React, { useState } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { Pagination } from 'antd';
import 'antd/dist/antd.css';

axios.defaults.baseURL = '';
axios.defaults.timeout = 200000;

axios.interceptors.request.use((config) => {
  const prefix = window.blocklet ? window.blocklet.prefix : window?.env?.apiPrefix;
  config.baseURL = prefix || '';

  return config;
});

const Home = () => {
  const [hashValue, setHashValue] = useState();
  const [blockInfo, setBlockInfo] = useState();
  const [pageBlockInfo, setPageBlockInfo] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  function onValueChange(e) {
    setHashValue(e?.target?.value);
  }

  function search() {
    axios.get(`https://blockchain.info/rawblock/${hashValue}`).then((response) => {
      console.warn(response);
      setBlockInfo(response?.data);
      setPageBlockInfo(response?.data?.tx?.slice(0, 10)); // 第一页数据
    });
  }

  function onPageChange(page) {
    setCurrentPage(page);
    setPageBlockInfo(blockInfo?.tx?.slice((page - 1) * 10, (page - 1) * 10 + 10)); // 第一页数据
  }

  return (
    <>
      <div className="search">
        <label htmlFor="input">
          Block Hash
          <input id="input" className="app-input" onChange={onValueChange} />
        </label>
        <button type="button" onClick={search} className="searchBtn">
          Search
        </button>
      </div>
      <div className="info-box">
        <div className="list">
          <div className="list-label">Hash</div>
          <div className="list-value">{blockInfo?.hash}</div>
        </div>
        <div className="list">
          <div className="list-label">Height</div>
          <div className="list-value">{blockInfo?.height}</div>
        </div>
        <div className="list">
          <div className="list-label">Number of Transactions</div>
          <div className="list-value">{blockInfo?.tx?.length}</div>
        </div>
        <div className="list">
          <div className="list-label">Weight</div>
          <div className="list-value">{blockInfo?.weight ? numeral(blockInfo?.weight).format('0,0') : ''}</div>
        </div>
        <div className="list">
          <div className="list-label">Size</div>
          <div className="list-value">{blockInfo?.size ? numeral(blockInfo?.size).format('0,0') : ''}</div>
        </div>
        <div className="list">
          <div className="list-label">Nonce</div>
          <div className="list-value">{blockInfo?.nonce ? numeral(blockInfo?.nonce).format('0,0') : ''}</div>
        </div>
        <div className="list">
          <div className="list-label">Hash</div>
          <div className="list-value">{blockInfo?.hash}</div>
        </div>
      </div>
      <h3 className="transaction-title">Block Transactions</h3>
      <div className="transaction">
        {pageBlockInfo?.map((t) => (
          <div className="transaction-box" key={t?.hash}>
            <div className="transaction-fee">
              <div className="label" style={{ width: '50%' }}>
                Fee
              </div>
              <div style={{ width: '100%' }}>{t?.fee}</div>
            </div>
            <div className="transaction-hash">
              <div className="label" style={{ width: '50%' }}>
                hash
              </div>
              <div style={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>{t?.hash}</div>
            </div>
          </div>
        ))}
        {blockInfo?.tx?.length > 0 && (
          <Pagination
            pageSize={10}
            onChange={(p) => onPageChange(p)}
            current={currentPage}
            total={blockInfo?.tx?.length}
          />
        )}
      </div>
    </>
  );
};

export default Home;
