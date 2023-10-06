import sgbRegistryData from "./SgbRegistry.json"
import sgbftso from "./sgbftso.json"
import React, { useEffect, useState, useRef } from 'react'
import './table.css'
import { JsonRpcProvider, Contract } from 'ethers'
import { Link } from 'react-router-dom';
import "./sgbTable.css"

export const SgbTable = () => {

  var provider = new JsonRpcProvider("https://rpc.ftso.au/songbird");

  const ftsoRegistryContract = new Contract(
    sgbRegistryData.address,
    sgbRegistryData.abi,
    provider
  );

  const ftsoContract = new Contract(sgbftso.address, sgbftso.abi, provider);
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

  const clickHandler = () => {
    console.log("Button clicked!");
  }

  return (
    <table>

      <thead>
        <tr>
          <div> 
            <td class="symbolHeader">FTSO Prices: Songbird</td>
          </div>
          {/* <div class="pricesHeader">
          <td> Price </td>
          </div> */}
        </tr>
      </thead>

      <tbody id="pricesTableBody">
        {!prices && <span>Loading...</span>}
        {prices && prices.map(p => <tr key={p.symbol}>
    
          {/* <img class="imageHolder" alt="" style={{ 'width': `24px`, 'margin-right': `10px` }} src={`https://cdn.flaremetrics.io/crypto-emblems/${p.symbol.toLowerCase()}_64x64.png`}></img> */}
          <td class="symbol"> {p.symbol}</td>
          <td class="price">{p.price}</td>
          

        </tr>)}

      </tbody>

      <div class="updateInfo">Last Update: <span id="timestamp">{prices ? new Date(prices[0].timestamp * 1000).toLocaleString() : ""}</span> </div>


      {/* <button onClick={clickHandler}>Flare</button> */}
      <Link to="/flare" className="btn btn-primary">Flare</Link>

    </table >

  )


}