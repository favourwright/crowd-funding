import React, { useContext, createContext} from "react"
import { useAddress, useContract, useContractWrite, useMetamask } from "@thirdweb-dev/react"
import { ethers } from "ethers"

const  StateContext = createContext()

export const StateContextProvider = ({ children }) =>{
  const { data: contract } = useContract('0x7d46d9E37f00d2cfd6Fdc7664486194580058337')
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign')

  const address = useAddress()
  const connect = useMetamask()

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({ args:[
        address, // person creating campaign
        form.title,
        form.description,
        form.target, // target amount to be raised
        new Date(form.deadline).getTime() / 1000, // unix timestamp
        form.image // image url
      ]})
      console.log({
        message: 'campaign created',
        data
      })
    } catch (error) {
      console.log({
        message: 'campaign creation failed',
        error
      })
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns')
    console.log({
      message: 'campaigns fetched',
      campaigns
    })
  }

  return (
    <StateContext.Provider value={{
      address,
      contract,
      connect,
      createCampaign: publishCampaign,
      getCampaigns,
    }}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)