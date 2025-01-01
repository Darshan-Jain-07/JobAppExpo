import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import CText from '../../components/CText'
import CustomFileUploader from '../../components/CFileUploader';
import Icon from 'react-native-vector-icons/FontAwesome'; // Use vector icons for buttons
import { ActivityIndicator, Button } from 'react-native-paper';
import DatePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import CustomImageUploader from '../../components/CimageUploader';
import { addResume, getResume } from '../../services/ResumeService';
import { useNavigation } from '@react-navigation/native';
import { getUserData } from '../../services/UserDataService';

// Form Validation Schema using Yup
const validationSchema = Yup.object({
  resume_name: Yup.string().required('Name is required'),
  resume_email: Yup.string().email('Invalid email format').required('Email is required'),
  resume_dob: Yup.date()
    .required('Date of Birth is required')
    .test('age', 'Age must be greater than 10 years', value => {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 10;
      }
      return age >= 10;
    }),
  resume_phone: Yup.string().required('Phone number is required'),
});

const ResumeForm = () => {
  const [extractedData, setExtractedData] = useState(null);
  const [formDataLoading, setFormDataLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [userData, setUserData] = useState(null)
  const [resumeData, setResumeData] = useState(null)

  // Handler function to receive the extracted data
  const handleExtractedData = (data) => {
    setExtractedData(data);
  };

  useEffect(() => {
      // Define an async function inside the useEffect
      const fetchData = async () => {
        try {
          const data = await getUserData();
          setUserData(data);
          console.log(data);
          
          const resData = await getResume(data?.applicant_id);
          setResumeData(resData?.[0]);
          console.log(resData);

          setIsDataLoaded(true);
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsDataLoaded(true);
        }
      };
    
      // Call the async function
      fetchData();
    }, [])

  if (!formDataLoading || !isDataLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
        <ActivityIndicator animating={true} color={"#000"} size={"large"} />
      </View>
    )
  }

  const handleSubmit = async (values) => {
    values.resume_dob = dayjs(values.resumeData).format("YYYY-MM-DD")
    let data = await addResume(values);
    console.log(data)
    if(data){
      navigation.navigate("Home",{screen:"Home Page"})
    }
    console.log('Form data submitted:', values);
  };

  const confirmDelete = (remove, index) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => remove(index) }
      ]
    );
  };

  return (
    <Formik
      initialValues={{
        resume_name: userData?.applicant_name,
        resume_email: userData?.applicant_email,
        applicant_id: userData?.applicant_id,
        resume_dob: resumeData?.resume_dob ? resumeData?.resume_dob : new Date(),
        resume_phone: userData?.applicant_phone,
        resume_address: resumeData?.resume_address || '',
        resume_linkedin: resumeData?.resume_linkedin || '',
        resume_skills: resumeData?.resume_skills || [''],
        resume_experience: resumeData?.resume_experience || [{ date: '', organization: '', role: '' }],
        resume_project: resumeData?.resume_project || [{ name: '', description: '' }],
        resume_education: resumeData?.resume_education || [{ degree: '', institution: '', marks: '', year: '' }],
        resume_hobby: resumeData?.resume_hobby || [''],
        resume_language: resumeData?.resume_language || [''],
        is_deleted: resumeData?.is_deleted || 'False',
        resume_additional_details: resumeData?.resume_additional_details || [''],
        resume_applicant_image_url: resumeData?.resume_applicant_image_url || null,
        resume_file_url: resumeData?.resume_file_url || null,
        resume_file_name: resumeData?.resume_file_name || null,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleBlur, handleSubmit, touched, errors, setFieldValue }) => (
        <ScrollView style={styles.container}
          scrollEnabled={formDataLoading}
          keyboardShouldPersistTaps="handled">
          <CustomFileUploader
            fieldKey="resume_file_url"
            values={values}
            setFieldValue={setFieldValue}
            placeholder="Upload your resume (PDF/DOCX)"
            onDataExtracted={handleExtractedData}
            setFormDataLoading={setFormDataLoading}
          />

          <View style={{ marginVertical: 6 }}>
            <CustomImageUploader
              setFieldValue={setFieldValue}
              fieldKey="resume_applicant_image_url"
              values={values}
              placeholder={"Select Your Profile Image"}
            />
            {/* {touched.applicant_image && errors.applicant_image && <CText sx={styles.errorText}>{errors.applicant_image}</CText>} */}
          </View>

          <CText fontWeight={600} color={"#888"}>Personal Details</CText>
          <View style={{ marginBottom: 12 }}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={values.resume_name}
              onChangeText={handleChange('resume_name')}
              onBlur={handleBlur('resume_name')}
            />
            {touched.resume_name && errors.resume_name && <CText sx={styles.errorText}>{errors.resume_name}</CText>}
          </View>

          <View style={{ marginBottom: 12 }}>
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={values.resume_phone}
              onChangeText={handleChange('resume_phone')}
              onBlur={handleBlur('resume_phone')}
            />
            {touched.resume_phone && errors.resume_phone && <CText sx={styles.errorText}>{errors.resume_phone}</CText>}
          </View>

          <View style={{ marginBottom: 12 }}>
            <TextInput
              style={{...styles.input, color:"#888"}}
              placeholder="Email"
              value={values.resume_email}
              editable={false}
              onChangeText={handleChange('resume_email')}
              onBlur={handleBlur('resume_email')}
              autoCapitalize='none'
            />
            {touched.resume_email && errors.resume_email && <CText sx={styles.errorText}>{errors.resume_email}</CText>}
          </View>

          {/* Date of Birth Field */}
          <View style={{ marginBottom: 12 }}>
            <View style={styles.datePickerContainer}>
              <CText style={styles.inputLabel} color={"#888"}>Date of Birth</CText>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                <Text>{dayjs(values.resume_dob).format("DD-MM-YYYY")}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DatePicker
                  value={new Date(values.resume_dob)}
                  mode="date"
                  display="calendar"
                  style={{ ...styles.input, paddingVertical: 10 }}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      // setDob(selectedDate);
                      setFieldValue('resume_dob', dayjs(selectedDate).format("YYYY-MM-DD"));
                    }
                  }}
                />
              )}
            </View>
            {touched.resume_dob && errors.resume_dob && <CText sx={styles.errorText}>{errors.resume_dob}</CText>}
          </View>

          <View style={{ marginBottom: 12 }}>
            {console.log(values?.resume_linkedin, "hello")}
            <TextInput
              style={styles.input}
              placeholder="LinkedIn ID"
              value={values.resume_linkedin}
              onChangeText={handleChange('resume_linkedin')}
              onBlur={handleBlur('resume_linkedin')}
            />
            {touched.resume_linkedin && errors.resume_linkedin && <Text style={styles.errorText}>{errors.resume_linkedin}</Text>}
          </View>

          <View style={{ marginBottom: 12 }}>
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={values.resume_address}
              onChangeText={handleChange('resume_address')}
              onBlur={handleBlur('resume_address')}
            />
            {touched.resume_address && errors.resume_address && <Text style={styles.errorText}>{errors.resume_address}</Text>}
          </View>


          {/* Skills Section */}
          <CText fontWeight={600} color={"#888"}>Skills</CText>
          <FieldArray name="resume_skills">
            {({ remove, push }) => (
              <View>
                {values.resume_skills.map((skill, index) => (
                  <View key={index}>
                    <TextInput
                      style={{ ...styles.input, marginBottom: 0 }}
                      placeholder={`Skill ${index + 1}`}
                      value={skill}
                      onChangeText={handleChange(`resume_skills[${index}]`)}
                    />
                    {values?.resume_skills?.length > 1 && (
                      <TouchableOpacity
                        onPress={() => confirmDelete(remove, index)}
                        style={styles.deleteButton}
                      >
                        <Icon name="trash" size={16} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => push('')}
                  style={styles.addButton}
                >
                  <CText style={styles.addButtonText} fontWeight={600}>
                    <Icon name="plus" size={16} color="#000" /> Add Skill
                  </CText>
                </TouchableOpacity>
              </View>
            )}
          </FieldArray>

          {/* Education Section */}
          <CText fontWeight={600} color={"#888"}>Education Details</CText>
          <FieldArray name="resume_education">
            {({ remove, push }) => (
              <View>
                {values.resume_education.map((edu, index) => (
                  <View key={index} style={styles.fieldContainer}>
                    <TextInput
                      style={{ ...styles.input, marginBottom: 0 }}
                      placeholder="Degree"
                      value={edu.degree}
                      onChangeText={handleChange(`resume_education[${index}].degree`)}
                    />
                    <TextInput
                      style={{ ...styles.input, marginBottom: 0 }}
                      placeholder="Institution"
                      value={edu.institution}
                      onChangeText={handleChange(`resume_education[${index}].institution`)}
                    />
                    <TextInput
                      style={{ ...styles.input, marginBottom: 0 }}
                      placeholder="Percentage (%)"
                      value={edu.marks}
                      onChangeText={handleChange(`resume_education[${index}].marks`)}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Year"
                      value={edu.year}
                      onChangeText={handleChange(`resume_education[${index}].year`)}
                    />
                    {values?.resume_education?.length > 1 && (
                      <TouchableOpacity
                        onPress={() => confirmDelete(remove, index)}
                        style={styles.deleteButton}
                      >
                        <Icon name="trash" size={16} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => push({ degree: '', institution: '', marks: '', year:'' })}
                  style={styles.addButton}
                >
                  <CText sx={styles.addButtonText} fontWeight={600}>
                    <Icon name="plus" size={16} color="#000" /> Add Education
                  </CText>
                </TouchableOpacity>
              </View>
            )}
          </FieldArray>

          {/* Experience Section */}
          <CText fontWeight={600} color={"#888"}>Experience Details</CText>
          <FieldArray name="resume_experience">
            {({ remove, push }) => (
              <View>
                {values.resume_experience.map((exp, index) => (
                  <View key={index} style={styles.fieldContainer}>
                    <TextInput
                      style={{ ...styles.input, marginBottom: 0 }}
                      placeholder="Date"
                      value={exp.date}
                      onChangeText={handleChange(`resume_experience[${index}].date`)}
                    />
                    <TextInput
                      style={{ ...styles.input, marginBottom: 0 }}
                      placeholder="Organization"
                      value={exp.organization}
                      onChangeText={handleChange(`resume_experience[${index}].organization`)}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Role"
                      value={exp.role}
                      onChangeText={handleChange(`resume_experience[${index}].role`)}
                    />
                    {values?.resume_experience?.length > 1 && (
                      <TouchableOpacity
                        onPress={() => confirmDelete(remove, index)}
                        style={styles.deleteButton}
                      >
                        <Icon name="trash" size={16} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => push({ date: '', organization: '', role: '' })}
                  style={styles.addButton}
                >
                  <CText sx={styles.addButtonText} fontWeight={600}>
                    <Icon name="plus" size={16} color="#000" /> Add Experience
                  </CText>
                </TouchableOpacity>
              </View>
            )}
          </FieldArray>

          {/* Project Section */}
          <CText fontWeight={600} color={"#888"}>Project Details</CText>
          <FieldArray name="resume_project">
            {({ remove, push }) => (
              <View>
                {values.resume_project.map((pro, index) => (
                  <View key={index} style={styles.fieldContainer}>
                    <TextInput
                      style={{ ...styles.input, marginBottom: 0 }}
                      placeholder="Name"
                      value={pro.name}
                      onChangeText={handleChange(`resume_project[${index}].name`)}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Description"
                      value={pro.description}
                      onChangeText={handleChange(`resume_project[${index}].description`)}
                    />
                    {values?.resume_project?.length > 1 && (
                      <TouchableOpacity
                        onPress={() => confirmDelete(remove, index)}
                        style={styles.deleteButton}
                      >
                        <Icon name="trash" size={16} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => push({ name: '', description: '' })}
                  style={styles.addButton}
                >
                  <CText sx={styles.addButtonText} fontWeight={600}>
                    <Icon name="plus" size={16} color="#000" /> Add Project
                  </CText>
                </TouchableOpacity>
              </View>
            )}
          </FieldArray>

          {/* Hobby Section */}
          <CText fontWeight={600} color={"#888"}>Hobby</CText>
          <FieldArray name="resume_hobby">
            {({ remove, push }) => (
              <View>
                {values.resume_hobby.map((resume_hobby, index) => (
                  <View key={index}>
                    <TextInput
                      style={{ ...styles.input, marginBottom: 0 }}
                      placeholder={`Hobby ${index + 1}`}
                      value={resume_hobby}
                      onChangeText={handleChange(`resume_hobby[${index}]`)}
                    />
                    {values?.resume_hobby?.length > 1 && (
                      <TouchableOpacity
                        onPress={() => confirmDelete(remove, index)}
                        style={styles.deleteButton}
                      >
                        <Icon name="trash" size={16} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => push('')}
                  style={styles.addButton}
                >
                  <CText sx={styles.addButtonText} fontWeight={600}>
                    <Icon name="plus" size={16} color="#000" /> Add Hobby
                  </CText>
                </TouchableOpacity>
              </View>
            )}
          </FieldArray>

          {/* Language Section */}
          <CText fontWeight={600} color={"#888"}>Language</CText>
          <FieldArray name="resume_language">
            {({ remove, push }) => (
              <View>
                {values.resume_language.map((resume_language, index) => (
                  <View key={index}>
                    <TextInput
                      style={{ ...styles.input, marginBottom: 0 }}
                      placeholder={`Language ${index + 1}`}
                      value={resume_language}
                      onChangeText={handleChange(`resume_language[${index}]`)}
                    />
                    {values?.resume_language?.length > 1 && (
                      <TouchableOpacity
                        onPress={() => confirmDelete(remove, index)}
                        style={styles.deleteButton}
                      >
                        <Icon name="trash" size={16} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => push('')}
                  style={styles.addButton}
                >
                  <CText sx={styles.addButtonText} fontWeight={600}>
                    <Icon name="plus" size={16} color="#000" /> Add Language
                  </CText>
                </TouchableOpacity>
              </View>
            )}
          </FieldArray>

          {/* Additional Details Section */}
          <CText fontWeight={600} color={"#888"}>Additional Details</CText>
          <FieldArray name="resume_additional_details">
            {({ remove, push }) => (
              <View>
                {values.resume_additional_details.map((resume_additional_details, index) => (
                  <View key={index}>
                    <TextInput
                      style={{ ...styles.input, marginBottom: 0 }}
                      placeholder={`Additional Details ${index + 1}`}
                      value={resume_additional_details}
                      onChangeText={handleChange(`resume_additional_details[${index}]`)}
                    />
                    {values?.resume_additional_details?.length > 1 && (
                      <TouchableOpacity
                        onPress={() => confirmDelete(remove, index)}
                        style={styles.deleteButton}
                      >
                        <Icon name="trash" size={16} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => push('')}
                  style={styles.addButton}
                >
                  <CText sx={styles.addButtonText} fontWeight={600}>
                    <Icon name="plus" size={16} color="#000" /> Add Details
                  </CText>
                </TouchableOpacity>
              </View>
            )}
          </FieldArray>

          <Button onPress={handleSubmit} style={{ borderRadius: 5 }} mode="contained" buttonColor={"black"}>Submit</Button>

          <View style={{ height: 50 }}></View>
        </ScrollView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  input: {
    // height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 10,
    // marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    // marginBottom: 12,
  },
  fieldContainer: {
    marginBottom: 12,
    position: 'relative',
  },
  addButton: {
    backgroundColor: '#DDD',
    padding: 10,
    marginBottom: 17,
    borderRadius: 50,
    borderColor: "#000",
    borderWidth: 1,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    textAlign: 'center',
    // marginBottom:7
  },
  deleteButton: {
    position: 'absolute',
    top: 7,
    right: 7,
    backgroundColor: '#f44336',
    padding: 5,
    borderRadius: 5,
  },
});

export default ResumeForm;
