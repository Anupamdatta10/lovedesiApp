import React, { Component } from 'react';
import { Alert, Modal, StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";
const screen = Dimensions.get("window");
const screenWidth = screen.width;
const screenheight = screen.height;
class GlobalModal extends Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}


	render() {
		const { body, onRequestClose, visible, footer, cancelbtnShow, savebtnShow, savebtnlabel, cancelbtnlabel, onCancel, header, headerTitle, showheaderTitle, showheaderCrossbtn, onSave } = this.props;
		return (
			<View>
				<Modal
					animationType="fade"
					transparent={true}
					visible={visible}
				>
					<View style={styles.modalDialog}>
						<View style={styles.modalContent}>
							
							
							 {header ? <View style={styles.modalHeader}>
								<>
								{showheaderTitle ?<Text style={styles.modalheading}>{headerTitle}</Text>: null}
									{showheaderCrossbtn?<TouchableOpacity activeOpacity={1} style={styles.cancelCrossbtn} onPress={onCancel} >
										{/* <Text style={styles.cancelBtn}><AntDesign name="close" size={20} color="#000" /></Text> */}
									</TouchableOpacity>: null}
								</>
							</View> : null}
							
							<View style={styles.modalBodyContent}>
								{body}
							</View>

							{footer ? <View style={styles.modalFooter}>
								<>
									{cancelbtnShow ? <TouchableOpacity activeOpacity={1} style={styles.cancelBox} onPress={onCancel} >
										<Text style={styles.cancelBtmBtn}>{cancelbtnlabel}</Text>
									</TouchableOpacity> : null}
									{savebtnShow ? <TouchableOpacity activeOpacity={1} style={styles.saveBox} onPress={onSave} >
										<Text style={styles.okBtn}>{savebtnlabel}</Text>
									</TouchableOpacity> : null}
								</>
							</View> : null}
						</View>
					</View>
				</Modal>

			</View>
		);


	}
}
// Globalmodal.contextType = AuthContext;
export default GlobalModal;
GlobalModal.defaultProps = {
	body: "",
	footer: true,
	cancelbtnShow: true,
	savebtnShow: true,
	savebtnlabel:"Save",
	cancelbtnlabel: "Cancel",
	header: true,
	headerTitle: "",
	showheaderTitle:true,
	showheaderCrossbtn:true,


};

const styles = StyleSheet.create({
	modalDialog: {
		flex: 1,
		//display:'flex',
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: 'rgba(52, 52, 52, 0.3)',
		// width:screenWidth,
		// height:screenheight,
		flexDirection:'column',
	},
	modalContent: {
		//height: 260,
		width: 300,
		backgroundColor: "#fff",
		//alignItems: 'flex-start',
		borderRadius: 15,
		// marginLeft: "auto",
		// marginRight: "auto",
		//paddingBottom:25,
		flexDirection:'column',
		flexWrap:'wrap',
		padding:0,
		justifyContent:'center',
		alignItems:'center',
		//flex: .46,
		flexDirection:'column',
		//display:'flex',
	},
	modalHeader:{
		width: '100%',
		textAlign:'center',
		flexDirection: 'row',
		flexWrap:'wrap',
		//backgroundColor:'red',
		alignItems:'center',
		paddingTop:15,
		height:50,

	},
	modalBodyContent:{
		width: '100%',
		flexDirection: 'row',
		flexWrap:'wrap',
		//backgroundColor:'pink',
		alignItems:'center',
		padding:0,
		//height:200,
	},
	modalFooter: {
		height: 60,
		paddingLeft: 20,
		paddingRight: 20,
		// borderTopWidth: 2,
		flexDirection: 'row',
		justifyContent: 'space-between',
		// borderTopColor: '#EBEBEB',
		width: '100%',
		backgroundColor:'#fff',
		paddingBottom:20,
		borderBottomLeftRadius:15,
		borderBottomRightRadius:15,


	},
	cancelBox: {
		width: '50%',
		paddingRight:5,
	},
	cancelBtmBtn:{
		borderWidth: 1,
		borderColor: '#828282',
		color:'#828282',
		fontSize:14,
		//lineHeight:24,
		fontFamily: 'Poppins-SemiBold',
		borderRadius:8,
		textAlign:'center',
		justifyContent:'center',
		alignItems:'center',
		flex:1,
		lineHeight:40,
	},
	saveBox: {
		width: '50%',
		paddingLeft:5,
	},
	okBtn:{
		fontSize:14,
		//lineHeight:24,
		fontFamily: 'Poppins-SemiBold',
		borderRadius:8,
		textAlign:'center',
		justifyContent:'center',
		alignItems:'center',
		backgroundColor:'#0070BA',
		color:'#fff',
		flex:1,
		lineHeight:40,
	},
	modalBody: {
		width: "100%",
		flex: 1,
		justifyContent: 'flex-start',
	},
	cancelCrossbtn:{
		width:'10%',
		//backgroundColor:'pink',
		alignSelf:'center',
		flexDirection:'row',
		justifyContent:"flex-start",
		marginTop:-15,
	},
	modalheading: {
        color: '#243656',
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
		textAlign:'center',
		alignSelf:'center',
		//backgroundColor:'green',
		width:'90%',
		paddingLeft:20,
    },

});
