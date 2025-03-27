import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { Ionicons } from "@expo/vector-icons";
// import { sendEmailHelpAndSupport } from "../../services/EmailService";

const FAQ = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Applicant");
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState(null); // Track expanded items
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [reportText, setReportText] = useState(""); // Report text input state

  const faqs = {
    Applicant: [
      {
        question: "How do I create a profile on the job portal?",
        answer:
          " Browse job listings, select a job, and click on Apply Now. You may need to upload a resume or fill in an application form.",
      },
      {
        question: "How can I apply for a job?",
        answer:
          " Browse job listings, select a job, and click on Apply Now.You may need to upload a resume or fill in an application form.",
      },
      {
        question: "Can I track my job application status?",
        answer:
          "Yes! You can check the status under the My Applications section. Recruiters may update it to Reviewed,Shortlisted,or Rejected.",
      },
      {
        question: "How do I contact customer support?",
        answer: "Via Email (support@traveltrekker.com), Live Chat, or Phone.",
      },
      {
        question: "Is customer support available 24/7?",
        answer: "Yes, we’re available anytime to assist you.",
      },
    ],
    Recruiter: [
      {
        question: "How do I post a job opening?",
        answer:
          "Go to the Post a Job section, fill in the job details (title, description, location, salary, etc.), and submit it for approval.",
      },
      {
        question: "How do I search for candidates?",
        answer:
          " Use our advanced search filters to find candidates based on skills, experience, and location. You can also view their resumes and contact them directly.",
      },
      {
        question: "Can I schedule interviews through the platform?",
        answer:
          " Yes! You can send interview invitations, set dates, and even conduct virtual interviews through the app.",
      },
      {
        question: "Is there a fee for posting jobs?",
        answer:
          "We offer both free and premium job postings. Premium posts get higher visibility. Check our pricing page for details.",
      },
    ],
    Company: [
      {
        question: "How do I register my company on the platform?",
        answer:
          " Click on Register Company,fill in company details, and verify your business through email or document submission.",
      },
      {
        question: "Can multiple recruiters manage job postings for my company?",
        answer:
          "Yes! You can add multiple recruiters under your company profile to manage job listings and applications.",
      },
      {
        question: " How do I showcase my company to job seekers?",
        answer:
          " You can create a company profile with a description, photos, videos, and employee testimonials to attract potential candidates.",
      },
    ],
  };

  const filteredFAQs = faqs[activeTab].filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitReport = async () => {
    // Handle form submission here, e.g., sending the report to the backend or email.
    console.log("Report Submitted: ", reportText);
    const emailSent = await sendEmailHelpAndSupport({ msg: reportText });
    console.log(emailSent);
    Alert.alert(
      "Report Submitted",
      "Thank you for your feedback! We will review your report shortly.",
      [{ text: "OK", onPress: () => setModalVisible(false) }]
    );
    setModalVisible(false); // Close modal after submission
    setReportText(""); // Reset the text input
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Help and Support</Text>
        <TouchableOpacity
          style={styles.report}
          onPress={() => setModalVisible(true)} // Open modal on press
        >
          <Ionicons name="ban-sharp" size={24} color="#003366" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {["Applicant", "Recruiter", "Company"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#003366" />
        <TextInput
          style={styles.searchBar}
          placeholder="Search FAQs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="filter" size={20} color="#003366" />
      </View>

      {/* FAQ List */}
      <FlatList
        data={filteredFAQs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.accordion}>
            <TouchableOpacity
              onPress={() => setExpanded(expanded === index ? null : index)} // Toggle collapse
            >
              <View style={styles.questionContainer}>
                <Text style={styles.question}>{item.question}</Text>
                <Ionicons
                  name={expanded === index ? "arrow-up" : "arrow-down"}
                  size={20}
                  color="#003366"
                />
              </View>
            </TouchableOpacity>
            <Collapsible collapsed={expanded !== index}>
              <Text style={styles.answer}>{item.answer}</Text>
            </Collapsible>
          </View>
        )}
      />

      {/* Modal for Reporting */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submit a Report</Text>
            <TextInput
              style={styles.reportInput}
              placeholder="Enter your report here"
              multiline
              value={reportText}
              onChangeText={setReportText}
            />
            <View style={styles.modalActions}>
              <Button
                title="Submit"
                color={"#000"}
                onPress={handleSubmitReport}
              />
              <Button
                title="Cancel"
                color={"#000"}
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003366",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tab: {
    padding: 10,
  },
  activeTab: {
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#003366",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  accordion: {
    marginBottom: 10,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 5,
  },
  question: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#003366",
  },
  answer: {
    padding: 10,
  },
  report: {
    marginLeft: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reportInput: {
    height: 100,
    // borderColor: '#003366',
    // borderWidth: 1,
    backgroundColor: "#ebebeb",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Button: {
    backgroundColor: "#000",
  },
});

export default FAQ;
