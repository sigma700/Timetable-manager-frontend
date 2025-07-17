import { useState } from 'react';
import { OtpKit } from 'react-otp-kit';
import 'react-otp-kit/dist/index.css';

function Otp({ value, onChange }) {
	const [otp, setOtp] = useState('');

	const handleChange = (newOtp) => {
		setOtp(newOtp);
	};

	return (
		<>
			<OtpKit
				value={value}
				onChange={onChange}
				type={'number'}
				autoSubmit={true}
				submitOtpButton={{ show: false }}
			/>
		</>
	);
}

export default Otp;
