import React from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";

import {
	firestore,
	convertCollectionsSnapshotToMap
} from "../../firebase/firebase.utils";

import { updateCollections } from "../../redux/shop/shop-actions";

import WithSpinner from "../../components/withSpinner/WithSpinner";

import CollectionsOverview from "../../components/collections-overview/CollectionsOverview";
import CollectionPage from "../collection/Collection";

const CollectionsOverviewWithSpinner = WithSpinner(CollectionsOverview);
const CollectionPageWithSpinner = WithSpinner(CollectionPage);

//convert functional component to a class component
class Shop extends React.Component {
	state = {
		loading: true
	};

	//will be a snapshot reprenstation of the collections array that we get from firestore
	unsubscribeFromSnapshot = null;

	//fetch the collections array from firestore with componentDidMount()
	componentDidMount() {
		const { updateCollections } = this.props;
		const collectionRef = firestore.collection("collections");

		this.unsubscribeFromSnapshot = collectionRef.onSnapshot(async snapshot => {
			const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
			updateCollections(collectionsMap);
			this.setState({ loading: false });
		});
	}

	render() {
		const { match } = this.props;
		const { loading } = this.state;
		return (
			<div className="shop-page">
				<Route
					exact
					path={`${match.path}`}
					render={props => (
						<CollectionsOverviewWithSpinner isLoading={loading} {...props} />
					)}
				/>
				<Route
					path={`${match.path}/:collectionId`}
					render={props => (
						<CollectionPageWithSpinner isLoading={loading} {...props} />
					)}
				/>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	updateCollections: collectionsMap =>
		dispatch(updateCollections(collectionsMap))
});

export default connect(null, mapDispatchToProps)(Shop);
