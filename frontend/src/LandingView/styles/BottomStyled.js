import styled from 'styled-components';
import mediaQueryFor from '../../_global_styles/responsive_querie';
import { colors, palette } from '../../colorVariables';

export const LandingContentContainer = styled.div`
	display: flex;
	margin: 200px auto 0px auto;
	justify-content: space-between;
`;

export const LandingContent = styled.div`
	display: flex;
	flex-flow: column;
	font-size: 1rem;
	margin: 200px 10px 0px 10px;
  width: 35%;
	color: ${colors.text};
  z-index:11;
	/* background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 49% ,rgba(0,0,0,0) 100%); */

	h1 {
		/* width: 60%; */
    margin: 0 4%;
    font-size: 5rem;
		line-height: 0.8;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		color: ${palette.gold};
		text-shadow: 5px 5px 20px #111;
	}
	p {
    
    margin: 10px 11%;
    font-size: 1.4rem;
    font-weight:400;
	}
  ${mediaQueryFor.lgDevice`
    position:absolute;
    display:flex;
    flex-flow:column;
    align-content:center;
    justify-content:center;
    bottom: 133px;
    left: 5%;
    h1 {
      margin: 0;
    font-size: 4.4rem;
    }
    p {
		width: 100%;
    margin: 0 auto;
    font-size:1rem;
    padding:5px;
	}
  `}
  ${mediaQueryFor.mdDevice`
    position:absolute;
    display:flex;
    flex-flow:column;
    align-content:center;
    justify-content:center;
    bottom: 133px;
    left: 5%;
    h1 {
      /* width:20%; */
      margin:0;
      font-size:3rem;
    }
    p {
		width: 100%;
    margin: 0 auto;
    font-size:1rem;
    padding:5px;
	}
  `}
	${mediaQueryFor.smDevice`
    position:absolute;
    display:flex;
    flex-flow:column;
    align-content:center;
    justify-content:center;
    bottom: 133px;
    left: 5%;
    h1 {
      /* width:20%; */
      margin:0;
      font-size:3rem;
    }
    p {
		width: 100%;
    margin: 0 auto;
    font-size:1rem;
    padding:5px;
	}
  `}
	${mediaQueryFor.xsDevice`

    h1 {
      margin:0 auto;
      width:98%;
      font-size:3rem;
    }
    p {
		width: 100%;
		margin: 0 auto;
    /* padding:5px; */
	}
  `}
`;
