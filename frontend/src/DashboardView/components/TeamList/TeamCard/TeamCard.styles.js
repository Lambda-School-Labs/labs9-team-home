import styled from 'styled-components';

/**
 * Color palette:
 * #17151B << Dark Gray
 * #FF8C63 << Orange
 * #FFD17C << Lt Orange
 * #DE3B61 << Red
 * #3F1F6A << Purple
 * #F1FCEF << Creme
 * #73FF6D << Green
 */

export const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: space-around;
	justify-content: space-around;
	width: 100%;
	border: 1px solid;
	color: #17151b;
	background-color: #f1fcef;
	border-radius: 5px;
	transition: background-color 250ms ease-in-out, transform 150ms ease;
	/* :first-child {
    border-radius: 5px 5px 0 0;
  }
  :last-child {
    border-radius: 0 0 5px 5px;
  } */
	h3 {
		width: 25%;
		font-size: 1.2rem;
		text-decoration: none;
	}
	p {
		width: 25%;
	}
	:hover {
		background-color: #ff8c63;
		color: #f1fcef;
	}
`;
