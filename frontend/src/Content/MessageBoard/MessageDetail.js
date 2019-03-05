import React, { Component } from 'react';

// ------------- gql imports ---------------------- //
import { Query, compose } from 'react-apollo';
import {
	addComment,
	updateComment,
	deleteComment,
	like,
	unLike
} from '../mutations/comments';
import {
	updateMessage,
	deleteMessage,
	subscribe,
	unsubscribe
} from '../mutations/messages';
import * as query from '../../constants/queries';

// ------------- styling libraries ---------------------- //
// import styled from 'styled-components';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';

import { colors } from '../../colorVariables';
// import mediaQueryFor from '../../_global_styles/responsive_querie';

// ------------- Modal styling imports ---------------------- //
import {
	StyledModal,
	StyledModalOverlay,
	StyledModalClose,
	StyledModalPaper,
	StyledModalIconButton,
	StyledModalTitle,
	StyledModalBody,
	StyledModalCardAction,
	StyledModalButton,
	StyledModalForm,
	StyledModalInput,
	StyledModalNewCommentInput,
	StyledModalNewCommentForm
} from '../Modal.styles';

class MessageDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			editingMessage: false,
			edited: null,
			title: '',
			content: '',
			commentContent: '',
			newComment: ''
		};
	}

	handleChange = e => this.setState({ [e.target.name]: e.target.value });

	resetState = () =>
		this.setState({
			editing: false,
			editingMessage: false,
			edited: null,
			title: '',
			content: '',
			commentContent: '',
			newComment: '',
			subscribed: null
		});

	//set subscribed to true, if the currentUser is subscribed
	componentDidUpdate = prevProps =>
		this.props.message !== prevProps.message
			? this.props.message !== null
				? this.props.message.subscribedUsers.find(user =>
						user._id === this.props.currentUser._id
							? this.setState({ subscribed: true })
							: this.setState({ subscribed: false })
				  )
				: null
			: null;

	render() {
		const {
			message,
			currentUser,
			updateMsgComment,
			addMsgComment,
			deleteMsgComment,
			updateMessage,
			deleteMessage,
			like,
			unLike,
			subscribe,
			unsubscribe
		} = this.props;

		if (message === null) return <> </>;
		return (
			<StyledModal //open the Dialog box this is the part that makes everything else around darker
				open={this.props.open}
				onClose={() => {
					this.props.hideModal();
					this.resetState();
				}}
			>
				{/* Close the dialog box button */}
				<StyledModalClose>
					<StyledModalIconButton
						onClick={() => {
							this.props.hideModal();
							this.resetState();
						}}
					>
						<CloseIcon />
					</StyledModalIconButton>
				</StyledModalClose>
				<StyledModalOverlay>
					{/* The header information: name, avatar */}
					<CardHeader
						avatar={
							<Avatar
								src={message.user.avatar}
								alt="avatar"
								style={{ height: '64px', width: '64px' }}
							/>
						}
						title={`${message.user.firstName} ${message.user.lastName}`}
						titleTypographyProps={{
							style: { color: colors.text }
						}}
					/>
					<StyledModalPaper>
						{/* Render the message, UNLESS someone has hit the Edit Button */}
						{this.state.editingMessage ? (
							<StyledModalForm
								onSubmit={e => {
									e.preventDefault();
									message.title = this.state.title;
									message.content = this.state.content;
									updateMessage({
										id: message._id,
										title: this.state.title,
										content: this.state.content
									}).then(() => this.resetState());
								}}
							>
								<StyledModalInput
									name="title"
									value={this.state.title}
									onChange={this.handleChange}
								/>

								<StyledModalInput
									name="content"
									value={this.state.content}
									onChange={this.handleChange}
									multiline
								/>
								<StyledModalButton type="submit">Save</StyledModalButton>
							</StyledModalForm>
						) : (
							<CardContent>
								<StyledModalTitle variant="h5" component="h3">
									{message.title}
								</StyledModalTitle>
								<StyledModalBody paragraph component="p">
									{message.content}
								</StyledModalBody>

								{/* Load all the images attached to the message */}
								{message.images.map((image, index) => (
									<img
										key={index}
										src={image}
										alt="message-img"
										style={{ maxWidth: '50%', height: 'auto' }}
									/>
								))}

								{/* Display all the button actions (edit, delete, subscribe) */}
								<StyledModalCardAction>
									{message.user._id === currentUser._id && (
										<>
											<StyledModalButton
												onClick={e => {
													e.preventDefault();
													if (!this.state.editing) {
														this.setState({
															editingMessage: true,
															title: message.title,
															content: message.content
														});
													} else {
														alert(
															"Please finish editing your comment by clicking 'SAVE' before editing the message."
														);
													}
												}}
											>
												Edit
											</StyledModalButton>
											<StyledModalButton
												onClick={e => {
													e.preventDefault();
													deleteMessage({
														id: message._id
													}).then(() => {
														this.resetState();
														this.props.hideModal();
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
												? unsubscribe({
														id: message._id,
														user: currentUser._id
												  })
												: subscribe({
														id: message._id,
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
					{/* Get the comments for the message */}
					<Query
						query={query.FIND_COMMENTS_BY_MESSAGE}
						variables={{ message: message._id }}
					>
						{({ loading, error, data: { findMsgCommentsByMessage } }) => {
							if (loading) return <p>Loading...</p>;
							if (error) return <p>Error</p>;
							return (
								<>
									{/* display all the comments */}
									<StyledModalTitle>Comments</StyledModalTitle>
									{findMsgCommentsByMessage.map(comment => (
										<StyledModalPaper key={comment._id}>
											<CardHeader
												avatar={
													<Avatar
														src={comment.user.avatar}
														alt="test"
														style={{ height: '32px', width: '32px' }}
													/>
												}
												title={`${comment.user.firstName} ${
													comment.user.lastName
												}`}
												titleTypographyProps={{
													style: { color: colors.text }
												}}
											/>
											{/* check to see if the user can edit the comments */}
											{this.state.editing && this.state.edited === comment ? (
												<StyledModalForm
													onSubmit={e => {
														e.preventDefault();
														updateMsgComment({
															id: this.state.edited._id,
															content: this.state.commentContent
														}).then(() => this.resetState());
													}}
												>
													<StyledModalInput
														name="commentContent"
														value={this.state.commentContent}
														onChange={this.handleChange}
														multiline
													/>
													<StyledModalButton type="submit">
														Save
													</StyledModalButton>
												</StyledModalForm>
											) : (
												<CardContent>
													<StyledModalBody component="p">
														{comment.content}
													</StyledModalBody>
													{/* Check to see if the comment is the users and thus can be edited or deleted */}
													<StyledModalCardAction>
														{comment.user._id === currentUser._id && (
															<>
																<StyledModalButton
																	onClick={e => {
																		e.preventDefault();
																		if (!this.state.editingMessage) {
																			this.setState({
																				editing: true,
																				edited: comment,
																				commentContent: comment.content
																			});
																		} else {
																			alert(
																				"Please finish editing your message by clicking 'SAVE' before editing a comment."
																			);
																		}
																	}}
																>
																	Edit
																</StyledModalButton>
																<StyledModalButton
																	onClick={e => {
																		e.preventDefault();
																		deleteMsgComment({
																			id: comment._id
																		});
																	}}
																>
																	Delete
																</StyledModalButton>
															</>
														)}
														{/* Like button */}
														<StyledModalButton
															onClick={e => {
																e.preventDefault();
																comment.likes.find(
																	({ _id }) => _id === currentUser._id
																)
																	? unLike({
																			id: comment._id
																	  })
																	: like({
																			id: comment._id
																	  });
															}}
														>
															{`${comment.likes.length} likes`}
														</StyledModalButton>
													</StyledModalCardAction>
												</CardContent>
											)}
										</StyledModalPaper>
									))}
									{/* Add a new comment form  */}
									<StyledModalNewCommentForm
										onSubmit={e => {
											e.preventDefault();
											addMsgComment({
												message: message._id,
												content: this.state.newComment
											}).then(this.resetState());
										}}
									>
										<StyledModalNewCommentInput
											value={this.state.newComment}
											name="newComment"
											onChange={this.handleChange}
											placeholder="Leave a comment..."
										/>
										<IconButton type="submit">
											<SendIcon style={{ color: colors.text }} />
										</IconButton>
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
	addComment,
	updateComment,
	deleteComment,
	updateMessage,
	deleteMessage,
	like,
	unLike,
	subscribe,
	unsubscribe
)(MessageDetail);
