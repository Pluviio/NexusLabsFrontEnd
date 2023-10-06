import flrRegistryData from "./FlrRegistry.json"
import flrftso from "./flrftso.json"
import React, { useEffect, useState, useRef } from 'react'
import './table.css'
import { JsonRpcProvider, Contract } from 'ethers'
import { Link } from 'react-router-dom';

export const FlrTable = () => {

  var provider = new JsonRpcProvider("https://rpc.ftso.au/flare");

  const ftsoRegistryContract = new Contract(
    flrRegistryData.address,
    flrRegistryData.abi,
    provider
  );

  const ftsoContract = new Contract(flrftso.address, flrftso.abi, provider);
  const [supportedSymbols, setSupportedSymbols] = useState([])
  const supportedSymbolsRef = useRef()
  supportedSymbolsRef.current = supportedSymbols
  const [prices, setPrices] = useState(null)
  const [initialize, setInitialized] = useState(false)

  const getSymbolPrices = async () => {
    if (supportedSymbolsRef.current.length === 0) return
    console.log(supportedSymbolsRef.current)
    const token = []

    for (let symbol of supportedSymbolsRef.current) {

      let response = await ftsoRegistryContract["getCurrentPrice(string)"](
        symbol
      );

      let price = Number(response._price) / 10 ** 5;
      let timestamp = Number(response._timestamp);

      console.log(symbol, price, timestamp);
      token.push({ symbol, price, timestamp })

    }
    setPrices(token)
  }

  useEffect(() => {
    ftsoRegistryContract.getSupportedSymbols().then(res => {
      setSupportedSymbols(res)
    })




  }, [])

  useEffect(() => {
    if (supportedSymbols.length > 0) {
      getSymbolPrices();

    }

  }, [supportedSymbols])

  if (!initialize) {
    ftsoContract.on("PriceFinalized", function () {
      console.log("Price Finzalized")
      getSymbolPrices();
    })
    setInitialized(true)
  }


  console.log(prices)
  return (
    <table>

      <thead>
        <tr>
          <td> Symbol </td>
          <td> Price </td>
        </tr>
      </thead>

      <tbody id="pricesTableBody">
        {!prices && <span>Loading...</span>}
        {prices && prices.map(p => <tr key={p.symbol}>
          <img alt="" style={{ 'width': `24px`, 'margin-right': `10px` }} src={`https://cdn.flaremetrics.io/crypto-emblems/${p.symbol.toLowerCase()}_64x64.png`}></img>
          <td> {p.symbol}</td>
          <td>{p.price}</td>
        </tr>)}

      </tbody>

      <div>Last Update: <span id="timestamp">{prices ? new Date(prices[0].timestamp * 1000).toLocaleString() : ""}</span> </div>
      {/* <button onClick="/">SongBird</button> */}
      <Link to="/" className="btn btn-primary">Songbird</Link>
    </table>

  )


}