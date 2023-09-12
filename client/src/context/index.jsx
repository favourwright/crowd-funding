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
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: new Date(campaign.deadline.toNumber() * 1000),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));
    return parsedCampaigns
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns()
    return allCampaigns.filter((campaign) => campaign.owner === address)
  }

  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});

    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }

  return (
    <StateContext.Provider value={{
      address,
      contract,
      connect,
      createCampaign: publishCampaign,
      getCampaigns,
      getUserCampaigns,
      donate,
      getDonations
    }}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)