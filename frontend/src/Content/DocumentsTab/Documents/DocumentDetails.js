import React from 'react';

// ------------- Component Imports ---------------------- //
import DocumentCommentDetail from './DocumentCommentDetails';

// ------------- gql Imports ---------------------- //
import { Query, compose, Mutation } from 'react-apollo';
import {
	deleteDocument,
	unsubscribeDoc,
	subscribeDoc
} from '../../mutations/documents';
import * as query from '../../../constants/queries';
import { addDocComment } from '../../mutations/doccomments';
import { UPDATE_DOCUMENT } from '../../../constants/mutations';

// ------------- Style Imports ---------------------- //
import styled from 'styled-components';
// import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
// import { colors } from '../../../colorVariables';
// import CardHeader from '@material-ui/core/CardHeader';
// import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
// import SendIcon from '@material-ui/icons/Send';

// ------------- Icon imports ------------------------------- //

import { FileAlt } from 'styled-icons/fa-solid/FileAlt';
// import { FileWord } from 'styled-icons/icomoon/FileWord';
// import { FileExcel } from 'styled-icons/fa-solid/FileExcel';
// import { FilePlay } from 'styled-icons/icomoon/FilePlay';
// import { FilePdf } from 'styled-icons/icomoon/FilePdf';
import { KeyboardArrowRight } from 'styled-icons/material/KeyboardArrowRight';

// ------------- Modal styling imports ---------------------- //
import {
	StyledModal,
	StyledModalOverlay,
	StyledModalClose,
	StyledModalPaper,
	StyledModalCardAction,
	StyledModalTitle,
	StyledModalBody,
	StyledModalButton,
	StyledModalForm,
	StyledModalInput,
	StyledModalIconButton,
	StyledModalNewCommentForm,
	StyledModalNewCommentInput
} from '../../Modal.styles';

// ---------------- Styled Components ---------------------- //

const ModalTitle = styled(StyledModalTitle)`
	h2 {
		font-size: 30px;
		text-align: center;
		margin-left: 30px;
	}
`;

const ModalBody = styled(StyledModalBody)`
	text-align: center;
	margin: 10px 0;
`;

const DocumentContent = styled(StyledModalBody)`
	text-align: center;
	width: 80%;
	margin: 20px auto;
	padding-top: 20px;
	border-top: 1px solid white;

	span {
		display: block;
		font-weight: bold;
		margin-bottom: 5px;
		font-size: 18px;
	}
`;

const DocUrl = styled(StyledModalBody)`
	margin: 10px auto;
	margin-top: 25px;
	text-align: center;
	padding: 5px;
	border-bottom: 1px solid #ecff26;
	width: 65px;
	cursor: pointer;

	a,
	a:hover {
		color: white;
		text-decoration: none;
	}

	&:hover {
		background-color: #392d40;
		transition: 0.3s all ease-in-out;
	}
`;
const DocumentIconDiv = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
`;

const DocumentIcon = styled(FileAlt)`
	height: 100px;
`;

// this needs to be a button for functionality purposes
const ArrowDiv = styled.button`
	height: 150px;
	display: flex;
	align-items: center;

	&:hover {
		background-color: #392d40;
		transition: 0.3s all ease-in-out;
	}
`;

const Arrow = styled(KeyboardArrowRight)`
	height: 25px;
`;

const FormDiv = styled.div`
	width: 95%;
	display: flex;
	flex-direction: row-reverse;
`;

const SortForm = styled.form`
	height: 50px;
	margin-top: 15px;
	label {
		color: white;
	}
	select {
		margin-left: 10px;
	}
	option {
		height: 25px;
	}
`;

class DocumentDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editingDocument: false,
			title: '',
			doc_url: '',
			textContent: '',
			editingComment: false,
			commentContent: '',
			editedComment: null,
			newCommentContent: '',
			subscribed: null,
			folderOption: 'Move to Folder'
		};
	}

	componentDidUpdate(prevProps) {
		if (this.props.document !== prevProps.document) {
			if (this.props.document !== null && this.props.document !== undefined) {
				if (
					this.props.document.subscribedUsers.find(
						user => user._id === this.props.currentUser._id
					) !== null
				) {
					this.setState({ subscribed: true });
				} else this.setState({ subscribed: false });
			}
		}
	}

	handleChange = e => this.setState({ [e.target.name]: e.target.value });

	resetState = () =>
		this.setState({
			editingDocument: false,
			title: '',
			doc_url: '',
			textContent: '',
			editingComment: false,
			commentContent: '',
			editedComment: null,
			newCommentContent: '',
			folderOption: 'Move to Folder'
		});

	folderChange = (e, updateDocument) => {
		if (e.target.value !== '') {
			//Moving a doc from the Documents container to a folder by using the drop down menu
			if (this.props.document.folder === null) {
				// console.log('moving into folder', e.target.value);
				updateDocument({
					variables: { id: this.props.document._id, folder: e.target.value },
					refetchQueries: [
						{
							query: query.FIND_DOCUMENTS_BY_TEAM,
							variables: { team: this.props.team }
						},
						{
							query: query.FIND_DOCUMENTS_BY_FOLDER,
							variables: { folder: e.target.value }
						}
					]
				});
			} else if (this.props.document.folder !== null) {
				//Moving a doc from a folder container to a another folder by using the drop down menu
				// console.log('moving folder to folder:', e.target.value);
				updateDocument({
					variables: {
						id: this.props.document._id,
						folder: e.target.value,
						previous: this.props.document.folder._id
					},
					refetchQueries: [
						{
							query: query.FIND_DOCUMENTS_BY_TEAM,
							variables: { team: this.props.team }
						},
						{
							query: query.FIND_DOCUMENTS_BY_FOLDER,
							variables: { folder: e.target.value }
						},
						{
							query: query.FIND_DOCUMENTS_BY_FOLDER,
							variables: { folder: this.props.document.folder._id }
						}
					]
				});
			} else {
				console.log('did we run an update?');
			}
		} else {
			console.log('pick a folder');
		}
		this.props.hideModal();
	};

	render() {
		const {
			deleteDocument,
			document,
			currentUser,
			hideModal,
			addDocComment,
			subscribeDoc,
			unsubscribeDoc,
			open
		} = this.props;

		if (document === null) return <></>;
		return (
			<StyledModal
				open={open}
				onClose={() => {
					hideModal();
					this.resetState();
				}}
			>
				<StyledModalClose>
					<StyledModalIconButton
						onClick={() => {
							hideModal();
							this.resetState();
						}}
					>
						<CloseIcon />
					</StyledModalIconButton>
				</StyledModalClose>
				<StyledModalOverlay>
					<StyledModalPaper>
						{this.state.editingDocument ? (
							<CardContent>
								<Mutation
									mutation={UPDATE_DOCUMENT}
									variables={{
										id: document._id,
										title: this.state.title,
										doc_url: this.state.doc_url,
										textContent: this.state.textContent
									}}
								>
									{updateDocument => (
										<StyledModalForm
											onSubmit={e => {
												e.preventDefault();
												document.title = this.state.title;
												document.textContent = this.state.textContent;
												document.doc_url = this.state.doc_url;
												updateDocument();
												this.resetState();
											}}
										>
											<StyledModalInput
												name="title"
												value={this.state.title}
												onChange={this.handleChange}
											/>
											<StyledModalInput
												name="doc_url"
												value={this.state.doc_url}
												onChange={this.handleChange}
											/>
											<StyledModalInput
												name="textContent"
												value={this.state.textContent}
												onChange={this.handleChange}
												multiline
											/>
											<StyledModalButton type="submit">Save</StyledModalButton>
										</StyledModalForm>
									)}
								</Mutation>
							</CardContent>
						) : (
							<CardContent>
								<ModalTitle>{document.title}</ModalTitle>
								<DocumentIconDiv>
									<DocumentIcon />
								</DocumentIconDiv>
								<a
									href={
										document.doc_url.includes('http://') ||
										document.doc_url.includes('https://')
											? document.doc_url
											: `http://www.${document.doc_url}`
									}
									target="_blank"
									rel="noopener noreferrer"
								>
									<DocUrl paragraph component="p">
										VIEW
									</DocUrl>
								</a>
								<FormDiv>
									<SortForm>
										<Mutation mutation={UPDATE_DOCUMENT}>
											{updateDocument => (
												<select
													value={this.state.folderOption}
													onChange={e => this.folderChange(e, updateDocument)}
												>
													<option value="">Move to ...</option>

													<Query
														query={query.FIND_FOLDERS_BY_TEAM}
														variables={{ team: this.props.team }}
													>
														{({
															loading,
															error,
															data: { findFoldersByTeam }
														}) => {
															if (loading) return 'Loading...';
															if (error) return console.error(error);
															if (
																findFoldersByTeam &&
																findFoldersByTeam.length > 0
															) {
																return findFoldersByTeam.map(folder => (
																	<option
																		key={folder._id}
																		value={`${folder._id}`}
																	>{`${folder.title}`}</option>
																));
															}
														}}
													</Query>
												</select>
											)}
										</Mutation>
									</SortForm>
								</FormDiv>
								<ModalBody>
									{console.log(document)}
									Posted by{' '}
									{`${document.user.firstName} ${document.user.lastName}`} •
									Tag:
									{` ${document.tag ? document.tag.name : 'none'}`}
								</ModalBody>
								<DocumentContent paragraph component="p">
									<span>Notes:</span>
									{document.textContent}
								</DocumentContent>

								<StyledModalCardAction>
									{document.user._id === currentUser._id && (
										<>
											<StyledModalButton
												onClick={e => {
													e.preventDefault();
													if (!this.state.editingComment) {
														this.setState({
															editingDocument: true,
															title: document.title,
															textContent: document.textContent,
															doc_url: document.doc_url
														});
													} else {
														alert(
															"Please finish editing your comment by clicking 'SAVE' before editing the document."
														);
													}
												}}
											>
												Edit
											</StyledModalButton>
											<StyledModalButton
												onClick={e => {
													e.preventDefault();
													deleteDocument({
														id: document._id
													}).then(() => {
														hideModal();
													});
												}}
											>
												Delete
											</StyledModalButton>
										</>
									)}

									{/* Subscribe or unsubscribe button */}
									<StyledModalButton
										onClick={e => {
											e.preventDefault();
											this.setState(prevState => ({
												subscribed: !prevState.subscribed
											}));
											this.state.subscribed
												? unsubscribeDoc({
														id: document._id,
														user: currentUser._id
												  })
												: subscribeDoc({
														id: document._id,
														user: currentUser._id
												  });
										}}
									>
										{this.state.subscribed ? 'Unsubscribe' : 'Subscribe'}
									</StyledModalButton>
								</StyledModalCardAction>
							</CardContent>
						)}
					</StyledModalPaper>
					{/* View all the comments of the document */}
					<Query
						query={query.FIND_COMMENTS_BY_DOCUMENT}
						variables={{ document: document._id }}
						//this needs a refetch
					>
						{({ loading, error, data: { findDocCommentsByDocument } }) => {
							if (loading) return <p>Loading...</p>;
							if (error) return <p>Error</p>;
							return (
								<>
									<StyledModalTitle>Discussion</StyledModalTitle>
									{/* Display all the comments */}
									{findDocCommentsByDocument.map(comment => (
										<DocumentCommentDetail
											key={comment._id}
											comment={comment}
											currentUser={currentUser}
											editingDocument={this.state.editingDocument}
											//this needs to be passed a function which triggers a refetch on all comments, when a comment is deleted
											{...this.props}
										/>
									))}
									{/* Add a new comment form  */}
									<StyledModalNewCommentForm
										onSubmit={e => {
											e.preventDefault();
											addDocComment({
												document: document._id,
												content: this.state.newCommentContent
											}).then(this.resetState());
										}}
									>
										<StyledModalNewCommentInput
											value={this.state.newCommentContent}
											name="newCommentContent"
											onChange={this.handleChange}
											placeholder="Leave a comment..."
										/>

										<ArrowDiv type="submit">
											<Arrow />
										</ArrowDiv>
									</StyledModalNewCommentForm>
								</>
							);
						}}
					</Query>
				</StyledModalOverlay>
			</StyledModal>
		);
	}
}

export default compose(
	addDocComment,
	deleteDocument,
	subscribeDoc,
	unsubscribeDoc
)(DocumentDetails);
