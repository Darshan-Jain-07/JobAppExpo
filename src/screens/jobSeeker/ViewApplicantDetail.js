import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Card, Chip, Title, Subheading, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing the FontAwesome icon set
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'; // Importing MaterialIcons icon set
import CText from '../../components/CText';
import { getResume } from '../../services/ResumeService';
import { getUserData } from '../../services/UserDataService';
import { getUserInfo } from '../../services/AuthService';

const ApplicantProfile = ({route}) => {
    const applicantId = route.params.applicationId || null;
    console.log(applicantId)
    const [applicant, setApplicant] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(null);

    useEffect(() => {
        // Define an async function inside the useEffect
        const fetchData = async () => {
          try {
            let data;
            if(applicantId !== null){
                let arr = await getUserInfo(applicantId)
                data = arr?.[0]
            }else{
                data = await getUserData();
            }

            setUserData(data);
            console.log(data, "data");
            
            let resData = await getResume(data?.applicant_id)
            console.log(resData)
            setApplicant(resData?.[0])
    
            setIsDataLoaded(true);
          } catch (error) {
            console.error('Error fetching data:', error);
            setIsDataLoaded(true);
          }
        };
      
        // Call the async function
        fetchData();
      }, [applicantId])

      if (!isDataLoaded) {
        return (
          <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
            <ActivityIndicator animating={true} color={"#000"} size={"large"} />
          </View>
        )
      }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };
    // const source = { uri: 'https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf', cache: true };
    return (
        <ScrollView style={styles.container}>
            {/* Profile Section */}
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.profileSection}>
                        <Image source={{ uri: userData?.applicant_profile_url }} style={styles.profileImage} />
                        <CText fontWeight={600} sx={styles.name}>{applicant?.resume_name}</CText>
                        <View style={styles.personalDetails}>
                            <View style={styles.detailRow}>
                                <MaterialIcon name="location-on" size={20} color="#888" />
                                <CText style={styles.personalDetailText}>{applicant?.resume_address}</CText>
                            </View>
                            <View style={styles.detailRow}>
                                <Icon name="envelope" size={20} color="#888" />
                                <CText style={styles.personalDetailText}>{applicant?.resume_email}</CText>
                            </View>
                            <View style={styles.detailRow}>
                                <Icon name="phone" size={20} color="#888" />
                                <CText style={styles.personalDetailText}>{applicant?.resume_phone}</CText>
                            </View>
                            <View style={styles.detailRow}>
                                <Icon name="linkedin" size={20} color="#888" />
                                <TouchableOpacity onPress={() => alert('Open LinkedIn')}>
                                    <CText style={styles.linkedin}>{applicant?.resume_linkedin}</CText>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.detailRow}>
                                <MaterialIcon name="calendar-today" size={20} color="#888" />
                                <CText style={styles.personalDetailText}>{formatDate(applicant?.resume_dob)}</CText>
                            </View>
                        </View>
                    </View>
                </Card.Content>
            </Card>

            {/* PDF Preview Section (Using WebView) */}
            {applicant?.resume_pdf_url && (
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Resume Preview</Title>

                    </Card.Content>
                </Card>
            )}

            {/* Skills Section */}
            <Card style={styles.card}>
                <Card.Content>
                    <CText fontWeight={600} fontSize={24} textAlign='center'>Skills</CText>
                    <View style={styles.skillsContainer}>
                        {applicant?.resume_skills.map((skill, index) => (
                            <Chip key={index} style={[styles.skillChip]} // Set background color here
                            textStyle={{ color: '#000' }}>
                                <CText fontWeight={600}>{skill}</CText>
                            </Chip>
                        ))}
                    </View>
                </Card.Content>
            </Card>

            {/* Experience Section */}
            <Card style={styles.card}>
                <Card.Content>
                    <CText fontWeight={600} fontSize={24} textAlign='center'>Experience</CText>
                    {applicant?.resume_experience.map((exp, index) => (
                        <Card key={index} style={styles.card}>
                            <Card.Content>
                                <CText fontSize={18} fontWeight={500}>{exp.role}</CText>
                                <CText fontSize={15}>{exp.organization}</CText>
                                <CText fontSize={12} textAlign='right' sx={{marginTop:5}}>{exp.date}</CText>
                            </Card.Content>
                        </Card>
                    ))}
                </Card.Content>
            </Card>

            {/* Education Section */}
            <Card style={styles.card}>
                <Card.Content>
                    <CText fontWeight={600} fontSize={24} textAlign='center'>Education</CText>
                    {applicant?.resume_education.map((edu, index) => (
                        <Card key={index} style={styles.card}>
                            <Card.Content>
                                <CText fontSize={20} fontWeight={500}>{edu.marks}</CText>
                                <CText fontSize={18} fontWeight={400}>{edu.degree}</CText>
                                <CText>{edu.institution}</CText>
                                <CText textAlign='right' fontSize={12}>{edu.year}</CText>
                            </Card.Content>
                        </Card>
                    ))}
                </Card.Content>
            </Card>

            {/* Projects Section */}
            <Card style={styles.card}>
                <Card.Content>
                    <CText fontWeight={600} fontSize={24} textAlign='center'>Projects</CText>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.projectsScroll}>
                        {applicant?.resume_project.map((project, index) => (
                            <Card key={index} style={styles.projectCard}>
                                <Card.Content>
                                    <CText fontSize={15} fontWeight={500}>{project.name}</CText>
                                    <CText>{project.description}</CText>
                                </Card.Content>
                            </Card>
                        ))}
                    </ScrollView>
                </Card.Content>
            </Card>

            {/* Hobby Section */}
            {applicant?.resume_hobby?.length > 0 && (
                <Card style={styles.card}>
                    <Card.Content>
                        <CText fontWeight={600} fontSize={24} textAlign='center'>Hobbies</CText>
                        <View style={styles.skillsContainer}>
                            {applicant?.resume_hobby.map((hobby, index) => (
                                <Chip key={index} style={styles.skillChip}>
                                    <CText fontWeight={600}>{hobby}</CText>
                                </Chip>
                            ))}
                        </View>
                    </Card.Content>
                </Card>
            )}

            {/* Languages Section */}
            {applicant?.resume_language.length > 0 && (
                <Card style={styles.card}>
                    <Card.Content>
                        <CText fontWeight={600} fontSize={24} textAlign='center'>Languages</CText>
                        <View style={styles.skillsContainer}>
                            {applicant?.resume_language.map((language, index) => (
                                <Chip key={index} style={styles.skillChip}>
                                    <CText fontWeight={600}>{language}</CText>
                                </Chip>
                            ))}
                        </View>
                    </Card.Content>
                </Card>
            )}

            {/* Additional Details Section */}
            {applicant?.resume_additional_details.length > 0 && (applicant?.resume_additional_details.length === 1 && applicant?.resume_additional_details?.[0] !== "") && (
                <Card style={styles.card}>
                    <Card.Content>
                        <CText fontWeight={600} fontSize={24} textAlign='center'>Additional Details</CText>
                        <View style={styles.skillsContainer}>
                            {applicant?.resume_additional_details.map((detail, index) => (
                                <Chip key={index} style={styles.skillChip}>
                                    {detail}
                                </Chip>
                            ))}
                        </View>
                    </Card.Content>
                </Card>
            )}
            <View style={{height:50}}></View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    card: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        marginBottom: 5,
    },
    personalDetails: {
        marginTop: 10,
        width: '100%',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    personalDetailText: {
        fontSize: 16,
        marginLeft: 10,
    },
    linkedin: {
        fontSize: 16,
        color: '#0073b1',
        marginBottom: 10,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skillChip: {
        margin: 5,
        color:"#fff",
        backgroundColor:"#DDD"
    },
    pdfViewer: {
        width: '100%',
        height: 400,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 400,
    },
    projectCard: {
        marginRight: 15,
        width: 200,
        backgroundColor: '#fff',
    },
    projectsScroll: {
        alignItems: 'flex-start',
        paddingVertical: 10,
    },
});

export default ApplicantProfile;
