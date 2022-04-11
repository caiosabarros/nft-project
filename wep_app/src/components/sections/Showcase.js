import React, { useEffect, useState, useRef } from "react";
import Web3 from 'web3';
import Button from "../Button";
import styled from "styled-components";
import { keyframes } from "styled-components";
import Contract from 'web3-eth-contract';
import TypeWriterText from "../TypeWriterText";

import baseContractABI from '../../contracts/baseContractABI.json'

import img1 from "../../assets/Nfts/bighead.svg";
import img2 from "../../assets/Nfts/bighead-1.svg";
import img3 from "../../assets/Nfts/bighead-2.svg";
import img4 from "../../assets/Nfts/bighead-3.svg";
import img5 from "../../assets/Nfts/bighead-4.svg";
import img6 from "../../assets/Nfts/bighead-5.svg";
import img7 from "../../assets/Nfts/bighead-6.svg";
import img8 from "../../assets/Nfts/bighead-7.svg";
import img9 from "../../assets/Nfts/bighead-8.svg";
import img10 from "../../assets/Nfts/bighead-9.svg";
import ETH from "../../assets/icons8-ethereum-48.png";

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.text};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  & > *:first-child {
    animation-duration: 20s;

    @media (max-width: 30em) {
      animation-duration: 15s;
    }
  }
  & > *:last-child {
    animation-duration: 15s;

    @media (max-width: 30em) {
      animation-duration: 10s;
    }
  }
`;

const move = keyframes`
  0%{ transform: translateX(100%)};
  100%{ transform: translateX(-100%)};
`;

const Row = styled.div`
  white-space: nowrap;
  box-sizing: content-box;
  margin: 2rem 0;
  display: flex;

  animation: ${move} linear infinite ${(props) => props.direction};
`;

const Box = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ImgContainer = styled.div`
  width: 15rem;
  margin: 0 1rem;
  background-color: ${(props) => props.theme.body};

  border-radius: 20px;
  cursor: pointer;

  @media (max-width: 48em) {
    width: 12rem;
  }

  @media (max-width: 30em) {
    width: 10rem;
  }

  img {
    width: 100%;
    height: auto;
  }
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  background-color: ${(props) => props.theme.text};
  border: 2px solid ${(props) => `rgba(${props.theme.bodyRgba}, 0.5)`};

  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  span {
    font-size: ${(props) => props.theme.fontsm};
    color: ${(props) => `rgba(${props.theme.bodyRgba}, 0.5)`};
    font-weight: 600;
    line-height: 1.5rem;
  }

  h1 {
    font-size: ${(props) => props.theme.fontmd};
    color: ${(props) => props.theme.body};
    font-weight: 600;

    @media (max-width: 30em) {
      font-size: ${(props) => props.theme.fontsm};
    }
  }
`;

const ButtonContainer = styled.div`
  width: 80%;
  align-self: flex-start;

  @media (max-width: 48em) {
    align-self: center;
    text-align: center;

    button {
      margin: 0 auto;
    }
  }
`;

const Price = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  img {
    width: 1rem;
    height: auto;
  }
`;



const NftItem = ({ img, number = 0, price = 0, passRef }) => {
  let play = (e) => {
    passRef.current.style.animationPlayState = "running";
  };
  let pause = (e) => {
    console.log(passRef.current)
    passRef.current.style.animationPlayState = "paused";
  };

  return (
    <ImgContainer onMouseOver={(e) => pause(e)} onMouseOut={(e) => play(e)}>
      <img src={img} alt="The Weirdos" />
      <Details>
        <div>
          <span>Weirdos</span> <br />
          <h1>#{number}</h1>
        </div>

        <div>
          <span>Price</span>
          <Price>
            <img src={ETH} alt="ETH" />
            <h1>{Number(price).toFixed(1)}</h1>
          </Price>
        </div>
      </Details>
    </ImgContainer>
  );
};

const Showcase = () => {
  //This params are being saved to be passed onto other pages later on through a context
  const [web3Provider, setWeb3Provider] = useState({})
  const [baseMintContract, setBaseMintContract] = useState({})

  const Row1Ref = useRef(null);
  const Row2Ref = useRef(null);

  const loadContract = async () => {
    let ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/d6e836f1b58444189bab1f7028484051"));
    Contract.setProvider(ETHEREUM_CLIENT);
    setWeb3Provider(ETHEREUM_CLIENT);
    let baseContract = new Contract(baseContractABI, '0x33CCa1820C93C20974E06ff366c3b28b06809277')
    setBaseMintContract(baseContract)
  }
  
  useEffect(()=>{
    loadContract()
  }, [])

  return (
    <Section id="showcase">
      <ButtonContainer>
        <Button text="Mint" link="#About" />
      </ButtonContainer>
      {/*<Row direction="none" ref={Row1Ref}>
        <NftItem img={img1} number={852} price={1.0} passRef={Row1Ref} />
        <NftItem img={img2} number={123} price={1.2} passRef={Row1Ref} />
        <NftItem img={img3} number={456} price={2.5} passRef={Row1Ref} />
        <NftItem img={img4} number={661} price={3.5} passRef={Row1Ref} />
        <NftItem img={img5} number={452} price={4.7} passRef={Row1Ref} />
      </Row>
      <Row direction="reverse" ref={Row2Ref}>
        <NftItem img={img6} number={888} price={1.2} passRef={Row2Ref} />
        <NftItem img={img7} number={211} price={3.2} passRef={Row2Ref} />
        <NftItem img={img8} number={455} price={1.8} passRef={Row2Ref} />
        <NftItem img={img9} number={456} price={5.1} passRef={Row2Ref} />
        <NftItem img={img10} number={865} price={3.7} passRef={Row2Ref} />
      </Row>*/}
    </Section>
  );
};

export default Showcase;
